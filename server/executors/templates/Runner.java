import java.io.*;
import java.util.*;
import java.lang.reflect.*;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONTokener;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        JSONTokener tokener = new JSONTokener(reader);
        List<JSONObject> testCases = new ArrayList<>();
        while (tokener.more()) {
            testCases.add(new JSONObject(tokener));
        }
        System.out.println(runTests(testCases, "%%FUNCNAME%%"));
    }

    public static String runTests(List<JSONObject> testCases, String funcName) {
        JSONArray results = new JSONArray();
        boolean allPassed = true;
        Solution solution = new Solution();
        Method methodToTest = findMethod(solution, funcName);

        for (JSONObject testCase : testCases) {
            Object input = testCase.get("input");
            Object expected = testCase.get("expected");

            JSONObject result = new JSONObject();
            result.put("input", input);
            result.put("expected", expected);

            try {
                Object[] args = prepareArguments(methodToTest, input);
                Object actual = methodToTest.invoke(solution, args);
                boolean passed = compareResults(actual, expected);
                if (!passed) allPassed = false;

                result.put("actual", formatResult(actual));
                result.put("passed", passed);
            } catch (Exception e) {
                allPassed = false;
                result.put("error", e.getCause() != null ? e.getCause().toString() : e.toString());
                result.put("passed", false);
            }
            results.put(result);
        }

        JSONObject finalResult = new JSONObject();
        finalResult.put("success", allPassed);
        finalResult.put("results", results);
        return finalResult.toString();
    }

    private static Method findMethod(Solution s, String name) {
        return Arrays.stream(s.getClass().getDeclaredMethods())
            .filter(m -> m.getName().equals(name))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Method not found: " + name));
    }

    private static Object[] prepareArguments(Method method, Object input) {
        Class<?>[] paramTypes = method.getParameterTypes();
        if (input instanceof JSONObject) {
            JSONObject inputMap = (JSONObject) input;
            String[] paramNames = getParameterNames(method);
            Object[] args = new Object[paramTypes.length];
            for (int i = 0; i < paramTypes.length; i++) {
                args[i] = convert(inputMap.get(paramNames[i]), paramTypes[i]);
            }
            return args;
        } else {
            return new Object[]{ convert(input, paramTypes[0]) };
        }
    }

    private static String[] getParameterNames(Method method) {
        // This is a simple heuristic. A more robust solution would use parameter reflection.
        if (method.getName().equals("twoSum")) return new String[]{"nums", "target"};
        if (method.getName().equals("isPalindrome")) return new String[]{"x"};
        // Add other problem parameter names here
        return new String[]{};
    }

    private static Object convert(Object obj, Class<?> targetType) {
        if (obj == null || targetType.isInstance(obj)) return obj;

        if (obj instanceof JSONArray && targetType == int[].class) {
            JSONArray jsonArray = (JSONArray) obj;
            int[] intArray = new int[jsonArray.length()];
            for (int i = 0; i < jsonArray.length(); i++) {
                intArray[i] = jsonArray.getInt(i);
            }
            return intArray;
        }

        if (obj instanceof Number) {
            Number n = (Number) obj;
            if (targetType == int.class || targetType == Integer.class) return n.intValue();
            if (targetType == long.class || targetType == Long.class) return n.longValue();
            if (targetType == double.class || targetType == Double.class) return n.doubleValue();
        }

        return obj;
    }

    private static boolean compareResults(Object actual, Object expected) {
        if (actual == null && expected == null) return true;
        if (actual == null || expected == null) return false;

        if (actual instanceof int[] && expected instanceof JSONArray) {
            int[] actualArray = (int[]) actual;
            JSONArray expectedArray = (JSONArray) expected;
            if (actualArray.length != expectedArray.length()) return false;
            for (int i = 0; i < actualArray.length; i++) {
                if (actualArray[i] != expectedArray.getInt(i)) return false;
            }
            return true;
        }

        return Objects.deepEquals(actual, expected);
    }

    private static Object formatResult(Object result) {
        if (result instanceof int[]) {
            return new JSONArray(result);
        }
        return result;
    }
}
