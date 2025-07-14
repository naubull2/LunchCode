from flask import Flask, render_template, request, jsonify
import json
import os
import time

app = Flask(__name__)

PROBLEMS_DIR = os.path.join(os.path.dirname(__file__), 'problems')


def list_problems():
    return [d for d in os.listdir(PROBLEMS_DIR)
            if os.path.isdir(os.path.join(PROBLEMS_DIR, d))]


def load_description(problem):
    path = os.path.join(PROBLEMS_DIR, problem, 'description.md')
    with open(path) as f:
        return f.read()


def load_tests(problem):
    path = os.path.join(PROBLEMS_DIR, problem, 'test_cases.json')
    with open(path) as f:
        return json.load(f)


def load_submit_tests(problem):
    """Load additional tests used for final submission."""
    path = os.path.join(PROBLEMS_DIR, problem, 'submit_tests.json')
    if os.path.exists(path):
        with open(path) as f:
            return json.load(f)
    return load_tests(problem)


def run_code(code: str, tests: list):
    """Execute user code against provided tests."""
    namespace = {}
    try:
        exec(code, namespace)
    except Exception as e:
        return None, f'Failed to execute code: {e}'
    solve = namespace.get('solve')
    if not callable(solve):
        return None, "Define a callable 'solve' function"
    results = []
    passed = 0
    for i, case in enumerate(tests, start=1):
        args = case.get('input', [])
        expected = case.get('output')
        try:
            start = time.perf_counter()
            result = solve(*args)
            duration = time.perf_counter() - start
            ok = result == expected
        except Exception as e:
            results.append({'test': i, 'error': str(e)})
            continue
        if ok:
            passed += 1
        results.append({'test': i, 'result': result, 'expected': expected, 'pass': ok, 'time': duration})
    return {'passed': passed, 'total': len(tests), 'results': results}, None


@app.route('/api/problems')
def api_problems():
    return jsonify(list_problems())


@app.route('/api/evaluate', methods=['POST'])
def api_evaluate():
    data = request.get_json(force=True)
    problem = data.get('problem')
    code = data.get('code', '')
    if not problem or problem not in list_problems():
        return jsonify({'error': 'Invalid problem'}), 400
    tests = load_tests(problem)
    result, error = run_code(code, tests)
    if error:
        return jsonify({'error': error})
    return jsonify(result)


@app.route('/api/submit', methods=['POST'])
def api_submit():
    data = request.get_json(force=True)
    problem = data.get('problem')
    code = data.get('code', '')
    if not problem or problem not in list_problems():
        return jsonify({'error': 'Invalid problem'}), 400
    tests = load_submit_tests(problem)
    result, error = run_code(code, tests)
    if error:
        return jsonify({'error': error})
    return jsonify(result)


@app.route('/')
def index():
    return render_template('index.html', problems=list_problems())


@app.route('/problem/<name>')
def problem_page(name):
    if name not in list_problems():
        return 'Problem not found', 404
    description = load_description(name)
    return render_template('problem.html', problem=name, description=description)


if __name__ == '__main__':
    app.run(debug=True)
