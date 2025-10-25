#!/usr/bin/env python3
"""
Quick test runner script for SuperCollider VS Code extension development.
Cross-platform (Windows, macOS, Linux)
"""

import sys
import subprocess
import os
import argparse
from pathlib import Path


# ANSI color codes
class Colors:
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    RED = '\033[0;31m'
    CYAN = '\033[0;36m'
    NC = '\033[0m'  # No Color
    
    @staticmethod
    def supports_color():
        """Check if terminal supports color"""
        return (
            hasattr(sys.stdout, 'isatty') and sys.stdout.isatty() and
            os.environ.get('TERM') != 'dumb'
        ) or os.environ.get('FORCE_COLOR') == '1'


def print_colored(message, color=''):
    """Print colored message if terminal supports it"""
    if Colors.supports_color() and color:
        print(f"{color}{message}{Colors.NC}")
    else:
        print(message)


def check_node_modules():
    """Check if node_modules exists, install if not"""
    if not Path('node_modules').exists():
        print_colored("⚠️  node_modules not found. Running npm install...", Colors.YELLOW)
        try:
            subprocess.run(['npm', 'install'], check=True)
        except subprocess.CalledProcessError as e:
            print_colored(f"❌ Failed to install dependencies: {e}", Colors.RED)
            sys.exit(1)


def run_command(cmd):
    """Run npm command and return exit code"""
    try:
        result = subprocess.run(cmd, shell=True, check=False)
        return result.returncode
    except Exception as e:
        print_colored(f"❌ Error running command: {e}", Colors.RED)
        return 1


def run_tests(test_type):
    """Run tests based on type"""
    commands = {
        'unit': ('npm run test:unit', 'Running Unit Tests (Fast)...'),
        'integration': ('npm run test:integration', 'Running Integration Tests...'),
        'all': ('npm test', 'Running All Tests...'),
        'compile': ('npm run compile', 'Compiling TypeScript...'),
        'lint': ('npm run lint', 'Running Linter...'),
        'watch': ('npm run watch', 'Starting Watch Mode...'),
    }
    
    if test_type not in commands:
        print_colored(f"❌ Unknown test type: {test_type}", Colors.RED)
        print("\nAvailable types:")
        for key in commands.keys():
            print(f"  - {key}")
        return 1
    
    cmd, message = commands[test_type]
    print_colored(message, Colors.GREEN)
    return run_command(cmd)


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description='Quick test runner for SuperCollider VS Code extension',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python scripts/test-quick.py unit          # Run unit tests only
  python scripts/test-quick.py integration   # Run integration tests only
  python scripts/test-quick.py all           # Run all tests
  python scripts/test-quick.py compile       # Compile TypeScript
  python scripts/test-quick.py lint          # Run linter
  python scripts/test-quick.py watch         # Start watch mode
        """
    )
    
    parser.add_argument(
        'test_type',
        nargs='?',
        default='all',
        choices=['unit', 'integration', 'all', 'compile', 'lint', 'watch'],
        help='Type of test to run (default: all)'
    )
    
    parser.add_argument(
        '--skip-install-check',
        action='store_true',
        help='Skip checking for node_modules'
    )
    
    args = parser.parse_args()
    
    # Print header
    print_colored("🧪 SuperCollider Extension - Quick Test Runner", Colors.CYAN)
    print_colored("================================================", Colors.CYAN)
    print()
    
    # Check dependencies
    if not args.skip_install_check:
        check_node_modules()
    
    # Run tests
    exit_code = run_tests(args.test_type)
    
    # Print result
    print()
    if exit_code == 0:
        print_colored("✅ Success!", Colors.GREEN)
    else:
        print_colored("❌ Failed!", Colors.RED)
    
    sys.exit(exit_code)


if __name__ == '__main__':
    main()

