from graphviz import Digraph

# Create a new directed graph
dot = Digraph(comment='COVID-19 Chatbot System Architecture')

# Define the nodes
dot.node('A', 'User')
dot.node('B', 'Chatbot Interface')
dot.node('C', 'Frontend (React)')
dot.node('D', 'Backend (Flask)')
dot.node('E', 'Chatbot Logic (NLP Model)')
dot.node('F', 'Database')
dot.node('G', 'External APIs (Testing Info)')
dot.node('H', 'User Response')
dot.node('I', 'Formatted Response')

# Define the edges
dot.edges(['AB', 'BC', 'CD', 'DE', 'DF', 'DG', 'EH', 'BI', 'HI'])

# Add labels for edges
dot.edge('A', 'B', label='Starts Conversation')
dot.edge('B', 'C', label='Sends User Message')
dot.edge('C', 'D', label='API Request')
dot.edge('D', 'E', label='Processes Request')
dot.edge('D', 'F', label='Fetches User Data')
dot.edge('D', 'G', label='Fetches Testing Information')
dot.edge('E', 'H', label='Generates Response')
dot.edge('B', 'I', label='Displays Formatted Response')
dot.edge('H', 'B', label='User Receives Response')

# Save the flowchart as a file
dot.render('flowchart', format='png', cleanup=True)  # This line should be correct

# Display the flowchart
dot.view()  # Opens the rendered file in the default viewer
