import os
import subprocess
import sys

# ==========================================
# PB BOOKS - FULL PROJECT GENERATOR SCRIPT
# ==========================================
# This script creates the entire project structure, installs all dependencies, 
# and sets up the configuration files automatically.

PROJECT_NAME = "pb-books-app"

def run_command(command, cwd=None):
    print(f"🚀 Running: {' '.join(command)}")
    subprocess.run(command, cwd=cwd, check=True, shell=sys.platform.startswith('win'))

def scaffold_project():
    print(f"\n--- 🧱 GENERATING PB BOOKS APP: {PROJECT_NAME} ---\n")
    
    # 1. Create React Vite App
    if not os.path.exists(PROJECT_NAME):
        run_command(["npm", "create", "vite@latest", PROJECT_NAME, "--", "--template", "react"])
    
    project_dir = os.path.join(os.getcwd(), PROJECT_NAME)
    
    # 2. Install Dependencies
    deps = [
        "firebase", "lucide-react", "clsx", "tailwind-merge", "framer-motion", 
        "epubjs", "pdfjs-dist", "@huggingface/transformers", "@emailjs/browser", 
        "payu-sdk", "tesseract.js"
    ]
    dev_deps = ["tailwindcss", "postcss", "autoprefixer"]
    
    run_command(["npm", "install"] + deps, cwd=project_dir)
    run_command(["npm", "install", "-D"] + dev_deps, cwd=project_dir)
    
    # 3. Initialize Tailwind
    run_command(["npx", "tailwindcss", "init", "-p"], cwd=project_dir)
    
    # 4. Write Tailwind Config (Strict Colors)
    tailwind_config = """
    /** @type {import('tailwindcss').Config} */
    export default {
      content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
      theme: {
        extend: {
          colors: {
            'pb-card': '#212830',
            'pb-deep': '#1B3A67',
            'pb-bg': '#0C1016',
            'pb-bg-elevated': '#0D1116',
            'pb-muted': '#D5D6D0',
            'pb-text': '#EFF0E6',
            'pb-primary': '#1E6FEA',
            'pb-hover': '#4290F3',
            'pb-accent': '#202930',
          }
        },
      },
      plugins: [],
    }
    """
    with open(os.path.join(project_dir, "tailwind.config.js"), "w") as f:
        f.write(tailwind_config)

    # 5. Write Index CSS
    index_css = """
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    body { background-color: #0C1016; color: #EFF0E6; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    """
    with open(os.path.join(project_dir, "src", "index.css"), "w") as f:
        f.write(index_css)

    print("\n✅ Setup Complete! To start the app:")
    print(f"cd {PROJECT_NAME}")
    print("npm run dev")
    print("\n⚠️ Note: Replace the contents of src/App.jsx with the full React code provided in the Canvas artifact.")

if __name__ == "__main__":
    scaffold_project()