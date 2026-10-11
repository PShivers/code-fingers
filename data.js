// Comprehensive Code Snippets for Codexterity
// Syntax markers:
// ^ = newline
// ~ = one indent level

export const codeSnippets = {
	javascript: [
		// Short
		{ id: "js-1", difficulty: "short", code: `const max = (a, b) => (a > b ? a : b);` },
		{ id: "js-2", difficulty: "short", code: `const sum = (arr) => arr.reduce((a, b) => a + b, 0);` },
		{ id: "js-3", difficulty: "short", code: `const unique = (arr) => [...new Set(arr)];` },
		{ id: "js-4", difficulty: "short", code: `const isEven = (n) => n % 2 === 0;` },
		{ id: "js-5", difficulty: "short", code: `const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);` },
		{ id: "js-6", difficulty: "short", code: `const sleep = (ms) => new Promise((r) => setTimeout(r, ms));` },
		{ id: "js-7", difficulty: "short", code: `const clamp = (v, min, max) => Math.min(Math.max(v, min), max);` },
		{ id: "js-8", difficulty: "short", code: `const zip = (a, b) => a.map((v, i) => [v, b[i]]);` },

		// Medium
		{ id: "js-9", difficulty: "medium", code: `function isPalindrome(s) {^~const rev = s.split("").reverse().join("");^~return s === rev;^}` },
		{ id: "js-10", difficulty: "medium", code: `function factorial(n) {^~if (n <= 1) return 1;^~return n * factorial(n - 1);^}` },
		{ id: "js-11", difficulty: "medium", code: `function debounce(fn, ms) {^~let timer;^~return (...args) => {^~~clearTimeout(timer);^~~timer = setTimeout(() => fn(...args), ms);^~};^}` },
		{ id: "js-12", difficulty: "medium", code: `function memoize(fn) {^~const cache = new Map();^~return (arg) => {^~~if (cache.has(arg)) return cache.get(arg);^~~const res = fn(arg);^~~cache.set(arg, res);^~~return res;^~};^}` },
		{ id: "js-13", difficulty: "medium", code: `function chunk(arr, size) {^~const res = [];^~for (let i = 0; i < arr.length; i += size) {^~~res.push(arr.slice(i, i + size));^~}^~return res;^}` },
		{ id: "js-14", difficulty: "medium", code: `function flatten(arr) {^~return arr.reduce((acc, val) => {^~~return acc.concat(Array.isArray(val) ? flatten(val) : val);^~}, []);^}` },

		// Long
		{ id: "js-15", difficulty: "long", code: `class EventEmitter {^~constructor() {^~~this.events = new Map();^~}^~on(event, listener) {^~~if (!this.events.has(event)) this.events.set(event, []);^~~this.events.get(event).push(listener);^~}^~emit(event, ...args) {^~~(this.events.get(event) || []).forEach((fn) => fn(...args));^~}^}` },
		{ id: "js-16", difficulty: "long", code: `function binarySearch(arr, target) {^~let left = 0, right = arr.length - 1;^~while (left <= right) {^~~const mid = Math.floor((left + right) / 2);^~~if (arr[mid] === target) return mid;^~~if (arr[mid] < target) left = mid + 1;^~~else right = mid - 1;^~}^~return -1;^}` },
		{ id: "js-17", difficulty: "long", code: `function deepClone(obj) {^~if (obj === null || typeof obj !== "object") return obj;^~if (Array.isArray(obj)) return obj.map(deepClone);^~const res = {};^~for (const key of Object.keys(obj)) {^~~res[key] = deepClone(obj[key]);^~}^~return res;^}` },
	],

	typescript: [
		// Short
		{ id: "ts-1", difficulty: "short", code: `type Nullable<T> = T | null | undefined;` },
		{ id: "ts-2", difficulty: "short", code: `type Result<T, E = Error> = { ok: true; data: T } | { ok: false; error: E };` },
		{ id: "ts-3", difficulty: "short", code: `const identity = <T>(value: T): T => value;` },
		{ id: "ts-4", difficulty: "short", code: `const keys = <T extends object>(obj: T): (keyof T)[] => Object.keys(obj) as (keyof T)[];` },
		{ id: "ts-5", difficulty: "short", code: `const isNumber = (val: unknown): val is number => typeof val === "number";` },
		{ id: "ts-6", difficulty: "short", code: `type DeepReadonly<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> };` },

		// Medium
		{ id: "ts-7", difficulty: "medium", code: `interface User {^~id: string;^~name: string;^~email?: string;^~role: "admin" | "user" | "guest";^}` },
		{ id: "ts-8", difficulty: "medium", code: `function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {^~const res = {} as Pick<T, K>;^~for (const k of keys) res[k] = obj[k];^~return res;^}` },
		{ id: "ts-9", difficulty: "medium", code: `async function fetchJson<T>(url: string): Promise<T> {^~const res = await fetch(url);^~if (!res.ok) throw new Error(\`HTTP \${res.status}\`);^~return (await res.json()) as T;^}` },
		{ id: "ts-10", difficulty: "medium", code: `function assertNonNull<T>(val: T | null | undefined): asserts val is T {^~if (val === null || val === undefined) {^~~throw new Error("Expected non-null value");^~}^}` },

		// Long
		{ id: "ts-11", difficulty: "long", code: `interface Stack<T> {^~push(item: T): void;^~pop(): T | undefined;^~peek(): T | undefined;^~size(): number;^}^~class ArrayStack<T> implements Stack<T> {^~private items: T[] = [];^~push(item: T): void { this.items.push(item); }^~pop(): T | undefined { return this.items.pop(); }^~peek(): T | undefined { return this.items[this.items.length - 1]; }^~size(): number { return this.items.length; }^}` },
		{ id: "ts-12", difficulty: "long", code: `type Action =^~| { type: "INCREMENT"; payload: number }^~| { type: "DECREMENT"; payload: number }^~| { type: "RESET" };^~function reducer(state: number, action: Action): number {^~switch (action.type) {^~~case "INCREMENT": return state + action.payload;^~~case "DECREMENT": return state - action.payload;^~~case "RESET": return 0;^~}^}` },
	],

	python: [
		// Short
		{ id: "py-1", difficulty: "short", code: `def add(a, b):^~return a + b` },
		{ id: "py-2", difficulty: "short", code: `def is_even(n):^~return n % 2 == 0` },
		{ id: "py-3", difficulty: "short", code: `def square(n):^~return n ** 2` },
		{ id: "py-4", difficulty: "short", code: `def clamp(v, lo, hi):^~return max(lo, min(v, hi))` },
		{ id: "py-5", difficulty: "short", code: `def unique(lst):^~return list(set(lst))` },
		{ id: "py-6", difficulty: "short", code: `def capitalize(s):^~return s[0].upper() + s[1:]` },

		// Medium
		{ id: "py-7", difficulty: "medium", code: `def is_palindrome(s):^~clean = "".join(c.lower() for c in s if c.isalnum())^~return clean == clean[::-1]` },
		{ id: "py-8", difficulty: "medium", code: `def factorial(n):^~if n <= 1:^~~return 1^~return n * factorial(n - 1)` },
		{ id: "py-9", difficulty: "medium", code: `def flatten(lst):^~return [x for sub in lst for x in sub]` },
		{ id: "py-10", difficulty: "medium", code: `def gcd(a, b):^~while b:^~~a, b = b, a % b^~return a` },
		{ id: "py-11", difficulty: "medium", code: `def chunk(lst, n):^~return [lst[i:i + n] for i in range(0, len(lst), n)]` },

		// Long
		{ id: "py-12", difficulty: "long", code: `def is_prime(n):^~if n < 2:^~~return False^~for i in range(2, int(n**0.5) + 1):^~~if n % i == 0:^~~~return False^~return True` },
		{ id: "py-13", difficulty: "long", code: `def quicksort(arr):^~if len(arr) <= 1:^~~return arr^~pivot = arr[len(arr) // 2]^~left = [x for x in arr if x < pivot]^~mid = [x for x in arr if x == pivot]^~right = [x for x in arr if x > pivot]^~return quicksort(left) + mid + quicksort(right)` },
		{ id: "py-14", difficulty: "long", code: `class Node:^~def __init__(self, val, next=None):^~~self.val = val^~~self.next = next^~def to_list(self):^~~res = []^~~curr = self^~~while curr:^~~~res.append(curr.val)^~~~curr = curr.next^~~return res` },
	],

	rust: [
		// Short
		{ id: "rs-1", difficulty: "short", code: `fn add(a: i32, b: i32) -> i32 {^~a + b^}` },
		{ id: "rs-2", difficulty: "short", code: `fn is_even(n: i64) -> bool {^~n % 2 == 0^}` },
		{ id: "rs-3", difficulty: "short", code: `fn square(n: i32) -> i32 {^~n * n^}` },
		{ id: "rs-4", difficulty: "short", code: `fn clamp(v: f64, min: f64, max: f64) -> f64 {^~v.max(min).min(max)^}` },
		{ id: "rs-5", difficulty: "short", code: `fn double_vec(v: &[i32]) -> Vec<i32> {^~v.iter().map(|x| x * 2).collect()^}` },

		// Medium
		{ id: "rs-6", difficulty: "medium", code: `fn factorial(n: u64) -> u64 {^~match n {^~~0 | 1 => 1,^~~_ => n * factorial(n - 1),^~}^}` },
		{ id: "rs-7", difficulty: "medium", code: `fn sum_slice(nums: &[i32]) -> i32 {^~nums.iter().sum()^}` },
		{ id: "rs-8", difficulty: "medium", code: `fn is_palindrome(s: &str) -> bool {^~let bytes = s.as_bytes();^~bytes.iter().zip(bytes.iter().rev()).all(|(a, b)| a == b)^}` },
		{ id: "rs-9", difficulty: "medium", code: `fn find_first<T: PartialEq>(slice: &[T], target: &T) -> Option<usize> {^~slice.iter().position(|x| x == target)^}` },

		// Long
		{ id: "rs-10", difficulty: "long", code: `pub fn binary_search(arr: &[i32], target: i32) -> Option<usize> {^~let mut lo = 0;^~let mut hi = arr.len();^~while lo < hi {^~~let mid = lo + (hi - lo) / 2;^~~match arr[mid].cmp(&target) {^~~~std::cmp::Ordering::Equal => return Some(mid),^~~~std::cmp::Ordering::Less => lo = mid + 1,^~~~std::cmp::Ordering::Greater => hi = mid,^~~}^~}^~None^}` },
		{ id: "rs-11", difficulty: "long", code: `enum OptionList<T> {^~Cons(T, Box<OptionList<T>>),^~Nil,^}^~impl<T> OptionList<T> {^~pub fn new() -> Self {^~~OptionList::Nil^~}^~pub fn push(self, val: T) -> Self {^~~OptionList::Cons(val, Box::new(self))^~}^}` },
	],

	go: [
		// Short
		{ id: "go-1", difficulty: "short", code: `func add(a, b int) int {^~return a + b^}` },
		{ id: "go-2", difficulty: "short", code: `func isEven(n int) bool {^~return n%2 == 0^}` },
		{ id: "go-3", difficulty: "short", code: `func max(a, b int) int {^~if a > b { return a }; return b^}` },
		{ id: "go-4", difficulty: "short", code: `func square(n int) int {^~return n * n^}` },

		// Medium
		{ id: "go-5", difficulty: "medium", code: `func sum(nums []int) int {^~total := 0^~for _, n := range nums {^~~total += n^~}^~return total^}` },
		{ id: "go-6", difficulty: "medium", code: `func contains(slice []string, val string) bool {^~for _, item := range slice {^~~if item == val { return true }^~}^~return false^}` },
		{ id: "go-7", difficulty: "medium", code: `func filter(arr []int, pred func(int) bool) []int {^~var out []int^~for _, v := range arr {^~~if pred(v) { out = append(out, v) }^~}^~return out^}` },

		// Long
		{ id: "go-8", difficulty: "long", code: `type Stack struct {^~items []int^}^~func (s *Stack) Push(v int) {^~s.items = append(s.items, v)^}^~func (s *Stack) Pop() (int, bool) {^~if len(s.items) == 0 { return 0, false }^~idx := len(s.items) - 1^~val := s.items[idx]^~s.items = s.items[:idx]^~return val, true^}` },
		{ id: "go-9", difficulty: "long", code: `func binarySearch(arr []int, target int) int {^~lo, hi := 0, len(arr)-1^~for lo <= hi {^~~mid := lo + (hi-lo)/2^~~if arr[mid] == target { return mid }^~~if arr[mid] < target { lo = mid + 1 } else { hi = mid - 1 }^~}^~return -1^}` },
	],

	c: [
		// Short
		{ id: "c-1", difficulty: "short", code: `int add(int a, int b) {^~return a + b;^}` },
		{ id: "c-2", difficulty: "short", code: `int is_even(int n) {^~return n % 2 == 0;^}` },
		{ id: "c-3", difficulty: "short", code: `int square(int n) {^~return n * n;^}` },
		{ id: "c-4", difficulty: "short", code: `int max(int a, int b) {^~return a > b ? a : b;^}` },
		{ id: "c-5", difficulty: "short", code: `void swap(int *a, int *b) {^~int t = *a; *a = *b; *b = t;^}` },

		// Medium
		{ id: "c-6", difficulty: "medium", code: `int factorial(int n) {^~if (n <= 1) return 1;^~return n * factorial(n - 1);^}` },
		{ id: "c-7", difficulty: "medium", code: `int str_len(const char *s) {^~int len = 0;^~while (*s++) len++;^~return len;^}` },
		{ id: "c-8", difficulty: "medium", code: `int sum_array(int arr[], int n) {^~int sum = 0;^~for (int i = 0; i < n; i++) sum += arr[i];^~return sum;^}` },
		{ id: "c-9", difficulty: "medium", code: `int gcd(int a, int b) {^~while (b != 0) {^~~int t = b; b = a % b; a = t;^~}^~return a;^}` },

		// Long
		{ id: "c-10", difficulty: "long", code: `int is_prime(int n) {^~if (n < 2) return 0;^~for (int i = 2; i * i <= n; i++) {^~~if (n % i == 0) return 0;^~}^~return 1;^}` },
		{ id: "c-11", difficulty: "long", code: `int binary_search(const int arr[], int n, int target) {^~int lo = 0, hi = n - 1;^~while (lo <= hi) {^~~int mid = lo + (hi - lo) / 2;^~~if (arr[mid] == target) return mid;^~~if (arr[mid] < target) lo = mid + 1;^~~else hi = mid - 1;^~}^~return -1;^}` },
	],

	cpp: [
		// Short
		{ id: "cpp-1", difficulty: "short", code: `int add(int a, int b) {^~return a + b;^}` },
		{ id: "cpp-2", difficulty: "short", code: `bool is_even(int n) {^~return n % 2 == 0;^}` },
		{ id: "cpp-3", difficulty: "short", code: `int square(int n) {^~return n * n;^}` },
		{ id: "cpp-4", difficulty: "short", code: `void swap(int &a, int &b) {^~int t = a; a = b; b = t;^}` },

		// Medium
		{ id: "cpp-5", difficulty: "medium", code: `int sum(const vector<int> &v) {^~int t = 0;^~for (int x : v) t += x;^~return t;^}` },
		{ id: "cpp-6", difficulty: "medium", code: `bool is_palindrome(const string &s) {^~int lo = 0, hi = s.size() - 1;^~while (lo < hi) {^~~if (s[lo++] != s[hi--]) return false;^~}^~return true;^}` },
		{ id: "cpp-7", difficulty: "medium", code: `bool has_duplicate(const vector<int> &v) {^~set<int> seen;^~for (int x : v) if (!seen.insert(x).second) return true;^~return false;^}` },

		// Long
		{ id: "cpp-8", difficulty: "long", code: `int binary_search(const vector<int> &v, int target) {^~int lo = 0, hi = v.size() - 1;^~while (lo <= hi) {^~~int mid = lo + (hi - lo) / 2;^~~if (v[mid] == target) return mid;^~~if (v[mid] < target) lo = mid + 1;^~~else hi = mid - 1;^~}^~return -1;^}` },
		{ id: "cpp-9", difficulty: "long", code: `template <typename T>^~class Node {^~public:^~~T val;^~~Node *next;^~~Node(T v) : val(v), next(nullptr) {}^~};` },
	],

	csharp: [
		// Short
		{ id: "cs-1", difficulty: "short", code: `int Add(int a, int b) => a + b;` },
		{ id: "cs-2", difficulty: "short", code: `bool IsEven(int n) => n % 2 == 0;` },
		{ id: "cs-3", difficulty: "short", code: `int Square(int n) => n * n;` },
		{ id: "cs-4", difficulty: "short", code: `string Greet(string name) => $"Hello, {name}!";` },

		// Medium
		{ id: "cs-5", difficulty: "medium", code: `int Sum(int[] arr) {^~int total = 0;^~foreach (int x in arr) total += x;^~return total;^}` },
		{ id: "cs-6", difficulty: "medium", code: `bool IsPalindrome(string s) {^~char[] arr = s.ToCharArray();^~Array.Reverse(arr);^~return s == new string(arr);^}` },
		{ id: "cs-7", difficulty: "medium", code: `int Clamp(int v, int lo, int hi) {^~return Math.Max(lo, Math.Min(v, hi));^}` },

		// Long
		{ id: "cs-8", difficulty: "long", code: `public class Stack<T> {^~private List<T> items = new();^~public void Push(T item) => items.Add(item);^~public T Pop() {^~~T val = items[^1];^~~items.RemoveAt(items.Count - 1);^~~return val;^~}^~public int Count => items.Count;^}` },
	],

	java: [
		// Short
		{ id: "java-1", difficulty: "short", code: `public static int add(int a, int b) {^~return a + b;^}` },
		{ id: "java-2", difficulty: "short", code: `public static boolean isEven(int n) {^~return n % 2 == 0;^}` },
		{ id: "java-3", difficulty: "short", code: `public static int square(int n) {^~return n * n;^}` },

		// Medium
		{ id: "java-4", difficulty: "medium", code: `public static int sum(int[] arr) {^~int sum = 0;^~for (int x : arr) sum += x;^~return sum;^}` },
		{ id: "java-5", difficulty: "medium", code: `public static boolean isPalindrome(String s) {^~String rev = new StringBuilder(s).reverse().toString();^~return s.equals(rev);^}` },
		{ id: "java-6", difficulty: "medium", code: `public static int gcd(int a, int b) {^~while (b != 0) {^~~int t = b; b = a % b; a = t;^~}^~return a;^}` },

		// Long
		{ id: "java-7", difficulty: "long", code: `public static int binarySearch(int[] arr, int target) {^~int lo = 0, hi = arr.length - 1;^~while (lo <= hi) {^~~int mid = lo + (hi - lo) / 2;^~~if (arr[mid] == target) return mid;^~~if (arr[mid] < target) lo = mid + 1;^~~else hi = mid - 1;^~}^~return -1;^}` },
		{ id: "java-8", difficulty: "long", code: `public class Node<T> {^~T val;^~Node<T> next;^~public Node(T val) {^~~this.val = val;^~~this.next = null;^~}^}` },
	],

	sql: [
		// Short
		{ id: "sql-1", difficulty: "short", code: `SELECT id, name, email FROM users;` },
		{ id: "sql-2", difficulty: "short", code: `SELECT count(*) FROM orders WHERE status = 'active';` },
		{ id: "sql-3", difficulty: "short", code: `DELETE FROM sessions WHERE expires_at < NOW();` },
		{ id: "sql-4", difficulty: "short", code: `UPDATE users SET is_verified = true WHERE id = 42;` },

		// Medium
		{ id: "sql-5", difficulty: "medium", code: `SELECT category, avg(price) AS avg_price^FROM products^GROUP BY category^HAVING avg(price) > 50;` },
		{ id: "sql-6", difficulty: "medium", code: `SELECT u.name, o.total^FROM users u^INNER JOIN orders o ON u.id = o.user_id^ORDER BY o.created_at DESC^LIMIT 10;` },

		// Long
		{ id: "sql-7", difficulty: "long", code: `CREATE TABLE employees (^~id INT PRIMARY KEY AUTO_INCREMENT,^~first_name VARCHAR(50) NOT NULL,^~last_name VARCHAR(50) NOT NULL,^~department VARCHAR(50),^~salary DECIMAL(10, 2),^~created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP^);` },
		{ id: "sql-8", difficulty: "long", code: `WITH ranked_orders AS (^~SELECT user_id, amount,^~~ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY amount DESC) as rk^~FROM orders^)^SELECT user_id, amount FROM ranked_orders WHERE rk = 1;` },
	],
};

// Backward-compatible array of strings for each language
export const codeBlocks = Object.fromEntries(
	Object.entries(codeSnippets).map(([lang, list]) => [
		lang,
		list.map((item) => item.code),
	])
);

export const LANGUAGES = [
	{ key: "javascript", label: "JavaScript", icon: "JS" },
	{ key: "typescript", label: "TypeScript", icon: "TS" },
	{ key: "python", label: "Python", icon: "PY" },
	{ key: "rust", label: "Rust", icon: "RS" },
	{ key: "go", label: "Go", icon: "GO" },
	{ key: "c", label: "C", icon: "C" },
	{ key: "cpp", label: "C++", icon: "C++" },
	{ key: "csharp", label: "C#", icon: "C#" },
	{ key: "java", label: "Java", icon: "JAVA" },
	{ key: "sql", label: "SQL", icon: "SQL" },
];

export const getLanguageSnippets = (lang = "javascript", difficulty = "all") => {
	const snippets = codeSnippets[lang] || codeSnippets.javascript;
	if (!difficulty || difficulty === "all") {
		return snippets;
	}
	const filtered = snippets.filter((s) => s.difficulty === difficulty);
	return filtered.length > 0 ? filtered : snippets;
};
