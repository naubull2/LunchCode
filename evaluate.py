import argparse
import importlib.util
import json
import os
import sys
from types import ModuleType


def load_solution(path: str) -> ModuleType:
    spec = importlib.util.spec_from_file_location("solution", path)
    module = importlib.util.module_from_spec(spec)
    loader = spec.loader
    if loader is None:
        raise ImportError(f"Cannot load module from {path}")
    loader.exec_module(module)  # type: ignore
    return module


def run_tests(solution_module: ModuleType, tests: list) -> None:
    if not hasattr(solution_module, "solve"):
        raise AttributeError("Solution file must define a 'solve' function")
    solve = getattr(solution_module, "solve")
    passed = 0
    for i, case in enumerate(tests, start=1):
        args = case.get("input", [])
        expected = case.get("output")
        try:
            result = solve(*args)
        except Exception as e:
            print(f"Test {i}: Exception occurred: {e}")
            continue
        if result == expected:
            passed += 1
            status = "PASSED"
        else:
            status = "FAILED"
        print(f"Test {i}: {status} (expected {expected}, got {result})")
    print(f"Passed {passed}/{len(tests)} tests.")


def main():
    parser = argparse.ArgumentParser(description="Evaluate Python solution against test cases")
    parser.add_argument("solution", help="Path to solution.py")
    parser.add_argument("tests", help="Path to test_cases.json")
    args = parser.parse_args()

    if not os.path.isfile(args.solution):
        print(f"Solution file not found: {args.solution}")
        sys.exit(1)
    if not os.path.isfile(args.tests):
        print(f"Test cases file not found: {args.tests}")
        sys.exit(1)

    with open(args.tests) as f:
        tests = json.load(f)

    solution_module = load_solution(args.solution)
    run_tests(solution_module, tests)


if __name__ == "__main__":
    main()
