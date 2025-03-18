from http.server import BaseHTTPRequestHandler
import json
import pulp

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        # Handle CORS preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            players = json.loads(post_data)
            
            # Define optimization problem
            budget = 150000000
            top_teams = []
            excluded_teams = []
            
            # Find top 5 teams
            for _ in range(5):
                result = find_best_team(players, budget, excluded_teams)
                
                # If no feasible team is found, break the loop
                if result is None:
                    break
                    
                # Add the team and its total price/score to the list
                top_teams.append(result)
                excluded_teams.append([player["id"] for player in result["players"]])
            
            # Send successful response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            # Send the JSON response
            response_json = json.dumps(top_teams)
            self.wfile.write(response_json.encode())
            
        except Exception as e:
            # Log the error
            print(f"Error processing request: {str(e)}")
            
            # Send error response
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

def find_best_team(players, budget, excluded_teams=None):
    problem = pulp.LpProblem("Best_Team_Selection", pulp.LpMaximize)

    # Decision variables
    player_vars = [pulp.LpVariable(f"player_{player['id']}", 0, 1, cat="Binary") for player in players]

    # Objective function: Maximize total score
    problem += pulp.lpSum([player_vars[i] * players[i]["score"] for i in range(len(players))])

    # Budget constraint
    problem += pulp.lpSum([player_vars[i] * players[i]["price"] for i in range(len(players))]) <= budget

    # Position constraints
    problem += pulp.lpSum([player_vars[i] for i in range(len(players)) if players[i]["position"] == "Defence"]) == 4
    problem += pulp.lpSum([player_vars[i] for i in range(len(players)) if players[i]["position"] == "Forward"]) == 3
    problem += pulp.lpSum([player_vars[i] for i in range(len(players)) if players[i]["position"] == "Midfield"]) == 3
    problem += pulp.lpSum([player_vars[i] for i in range(len(players)) if players[i]["position"] == "Goal Keeper"]) == 1

    # Exclude previously selected teams
    if excluded_teams:
        for team in excluded_teams:
            # Ensure at least one player is different from the excluded team
            problem += pulp.lpSum([player_vars[i] for i in range(len(players)) if players[i]["id"] in team]) <= 10

    # Solve the problem without solver logs
    problem.solve(pulp.PULP_CBC_CMD(msg=False))

    # Check if a feasible solution was found
    if pulp.LpStatus[problem.status] == "Infeasible":
        return None

    # Extract the selected players
    selected_players = [players[i] for i in range(len(players)) if pulp.value(player_vars[i]) == 1]

    # Calculate total price and total score for the team
    total_price = sum(player["price"] for player in selected_players)
    total_score = sum(player["score"] for player in selected_players)

    return {
        "players": selected_players,
        "total_price": total_price,
        "total_score": total_score,
    }