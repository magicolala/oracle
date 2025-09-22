"""
This script provides a comprehensive demonstration of the Oracle chess engine's features.

It covers:
1.  Command-Line Interface (CLI) tool usage:
    - `oracle_one_move.py`: For single-move predictions.
    - `oracle_pgn_file.py`: For batch analysis of PGN files.
2.  Web interface instructions.
3.  Configuration via environment variables.
4.  An overview of the output formats.

Please ensure you have installed the project dependencies using Poetry before running this demo.
"""
import os
import subprocess
import sys

def run_command(command: list[str]):
    """Runs a command and prints its output."""
    print(f"\n--- Running command: {' '.join(command)} ---\n")
    try:
        process = subprocess.run(
            command,
            check=True,
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        print("--- Command successful ---
")
        if process.stdout:
            print("--- STDOUT ---
")
            print(process.stdout)
        if process.stderr:
            print("--- STDERR ---
")
            print(process.stderr)
    except FileNotFoundError:
        print(f"Error: Command not found. Please ensure '{command[0]}' is in your PATH.")
    except subprocess.CalledProcessError as e:
        print(f"--- Command failed with exit code {e.returncode} ---")
        if e.stdout:
            print("--- STDOUT ---
")
            print(e.stdout)
        if e.stderr:
            print("--- STDERR ---
")
            print(e.stderr)
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


def main():
    """Main function to run the demo."""
    print("--- Oracle Chess Engine Demo ---")

    # --- Configuration ---
    print("\n--- 1. Configuration ---\n")
    print("Oracle can be configured using environment variables.")
    print("Create a .env file in the root directory or set them in your shell.")
    print("Example .env file content:")
    print("HUGGINGFACEHUB_API_TOKEN='your_hugging_face_token'")
    print("HUGGINGFACE_MODEL_ID='mistralai/Mistral-7B-Instruct-v0.2'")
    print("STOCKFISH_PATH='/path/to/your/stockfish'")

    # --- CLI Demos ---
    print("\n--- 2. CLI Demos ---\n")

    # --- oracle_one_move.py ---
    print("\n--- 2.1. oracle_one_move.py ---\n")
    print("This script provides an interactive way to get move predictions.")
    print("You will be prompted to enter a PGN, and then you can navigate the moves.")
    print("To run it, execute: python oracle_one_move.py")
    print("Here is a sample PGN you can paste when prompted:")
    print("""
[Event "FIDE World Championship 2023"]
[Site "Astana, Kazakhstan"]
[Date "2023.04.09"]
[Round "1.1"]
[White "Nepomniachtchi, Ian"]
[Black "Ding, Liren"]
[Result "1/2-1/2"]
[WhiteElo "2795"]
[BlackElo "2788"]
[TimeControl "40/7200:20/3600:15/900+30"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. d3 b5 7. Bb3 d6 8. a3 O-O
END
""")
    print("\nNOTE: The interactive script is not run as part of this automated demo.")

    # --- oracle_pgn_file.py ---
    print("\n--- 2.2. oracle_pgn_file.py ---\n")
    print("This script processes a PGN file and saves the analysis to a CSV file.")

    # Check for stockfish path
    stockfish_path = os.getenv("STOCKFISH_PATH")
    if not stockfish_path:
        print("\nWARNING: STOCKFISH_PATH environment variable not set.")
        print("The following command will likely fail.")
        print("Please set it to the path of your Stockfish executable.")
        # Set a dummy path to show the command
        stockfish_path = "stockfish"


    # Prepare paths for the demo
    pgn_file = os.path.join("tests", "data", "lichess_raw.pgn")
    output_csv = "demo_output.csv"

    print(f"\nDemonstrating with PGN file: '{pgn_file}'")
    print(f"Output will be saved to: '{output_csv}'")

    # Build and run the command
    # We need to find the python executable that poetry is using
    try:
        poetry_env_info = subprocess.run(
            ["poetry", "env", "info", "-p"],
            check=True,
            capture_output=True,
            text=True
        )
        python_executable = os.path.join(poetry_env_info.stdout.strip(), "bin", "python")
        if sys.platform == "win32":
             python_executable = os.path.join(poetry_env_info.stdout.strip(), "Scripts", "python.exe")

    except (subprocess.CalledProcessError, FileNotFoundError):
        print("\nCould not determine poetry environment python executable.")
        print("Using 'python' which might not have the correct dependencies installed.")
        python_executable = "python"


    command = [
        python_executable,
        "oracle_pgn_file.py",
    ]
    # The script is interactive, so we can't fully automate it without
    # modifying the script to take arguments.
    # For now, we will just show the command.
    print("\nTo run the script, you would execute a command like this:")
    print(f"{' '.join(command)}")
    print("\nThe script will then prompt you for the PGN file path, output file path, Hugging Face token, etc.")
    print("\nFor a fully automated run, the script would need to be modified to accept command-line arguments.")


    # --- Web Interface Demos ---
    print("\n--- 3. Web Interface Demos ---\n")
    print("The project includes a FastAPI web application.")
    print("To run it, execute the following command:")
    print("poetry run uvicorn src.oracle.web.app:app --reload")
    print("\nThen open your browser to http://127.0.0.1:8000")
    print("The web interface allows for:")
    print("- Analysis Mode: Paste a PGN and get move predictions.")
    print("- Play Mode: Play against the Oracle engine at different levels.")

    # --- Output Showcase ---
    print("\n--- 4. Output Showcase ---\n")
    print("The CLI tools and web interface provide rich output, including:")
    print("- Likelihood percentages for each move.")
    print("- Win percentage evaluations from Stockfish.")
    print("- Move notations and principal variations.")
    print("- Metrics such as tokens used and cost (if applicable).")
    print("\nThe CSV output from 'oracle_pgn_file.py' contains a detailed breakdown of the analysis for each move.")


if __name__ == "__main__":
    main()
