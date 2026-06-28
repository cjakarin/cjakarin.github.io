// ============ C++ source code for all 6 implementations ============
// Each source is { title, fileName, code } where code lines are 1-indexed
// (matching step.codeLines values from the algorithm engines).

// ---------- Linked List — Array Implementation ----------

const CPP_LL_ARRAY = {
  insertHead: {
    title: 'insertAtHead',
    fileName: 'arraylist_insert_head.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class ArrayList {
private:
    int arr[MAX];
    int size;
public:
    ArrayList() : size(0) {}

    // แทรก value ที่ตำแหน่งแรกของ array
    void insertAtHead(int value) {
        if (size >= MAX) return;            // 1 ตรวจ full
        for (int i = size; i > 0; i--) {    // 2 เลื่อนทุกตัวไปทางขวา
            arr[i] = arr[i - 1];            // 3
        }
        arr[0] = value;                     // 4 ใส่ value ที่ index 0
        size++;                             // 5 เพิ่ม size
    }
};`,
  },
  insertTail: {
    title: 'insertAtTail',
    fileName: 'arraylist_insert_tail.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class ArrayList {
private:
    int arr[MAX];
    int size;
public:
    ArrayList() : size(0) {}

    // แทรก value ที่ท้าย array
    void insertAtTail(int value) {
        if (size >= MAX) return;   // 1 ตรวจ full
        arr[size] = value;         // 2 ใส่ที่ตำแหน่ง size
        size++;                    // 3 เพิ่ม size
    }
};`,
  },
  insertAt: {
    title: 'insertAt',
    fileName: 'arraylist_insert_at.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class ArrayList {
private:
    int arr[MAX];
    int size;
public:
    ArrayList() : size(0) {}

    // แทรก value ที่ตำแหน่ง pos (0-indexed)
    void insertAt(int value, int pos) {
        if (size >= MAX || pos < 0 || pos > size) return;  // 1 ตรวบขอบเขต
        for (int i = size; i > pos; i--) {                 // 2 เลื่อนขวา
            arr[i] = arr[i - 1];                           // 3
        }
        arr[pos] = value;                                  // 4 ใส่ value
        size++;                                            // 5 ลด size
    }
};`,
  },
  deleteAt: {
    title: 'deleteAt',
    fileName: 'arraylist_delete_at.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class ArrayList {
private:
    int arr[MAX];
    int size;
public:
    ArrayList() : size(0) {}

    // ลบ element ที่ตำแหน่ง pos
    void deleteAt(int pos) {
        if (pos < 0 || pos >= size) return;          // 1 ตรวจขอบเขต
        for (int i = pos; i < size - 1; i++) {       // 2 เลื่อนซ้าย
            arr[i] = arr[i + 1];                     // 3
        }
        size--;                                      // 4 ลด size
    }
};`,
  },
  search: {
    title: 'search',
    fileName: 'arraylist_search.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class ArrayList {
private:
    int arr[MAX];
    int size;
public:
    ArrayList() : size(0) {}

    // ค้นหา value — คืน index แรกที่พบ หรือ -1
    int search(int value) {
        for (int i = 0; i < size; i++) {     // 1 วนทุก index
            if (arr[i] == value) {           // 2 ตรงค่า?
                return i;                    // 3 คืน index
            }
        }
        return -1;                           // 4 ไม่พบ
    }
};`,
  },
  traverse: {
    title: 'traverse',
    fileName: 'arraylist_traverse.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class ArrayList {
private:
    int arr[MAX];
    int size;
public:
    ArrayList() : size(0) {}

    // พิมพ์ทุก element
    void traverse() {
        for (int i = 0; i < size; i++) {       // 1 วน 0..size-1
            cout << arr[i] << " -> ";          // 2 พิมพ์แต่ละตัว
        }
        cout << "NULL" << endl;                // 3 ปิดท้าย
    }
};`,
  },
};

// ---------- Linked List — Pointer Implementation ----------

const CPP_LL_POINTER = {
  insertHead: {
    title: 'insertAtHead',
    fileName: 'll_insert_head.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedList {
private:
    Node* head;
public:
    LinkedList() : head(nullptr) {}

    // แทรก Node ใหม่ที่หัวของลิสต์
    void insertAtHead(int value) {
        Node* newNode = new Node(value);   // 1 สร้าง Node ใหม่
        newNode->next = head;              // 2 ชี้ next ไปยัง head เดิม
        head = newNode;                    // 3 ย้าย head มาชี้ newNode
    }
};`,
  },
  insertTail: {
    title: 'insertAtTail',
    fileName: 'll_insert_tail.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedList {
private:
    Node* head;
public:
    LinkedList() : head(nullptr) {}

    // แทรก Node ใหม่ที่ท้ายลิสต์
    void insertAtTail(int value) {
        Node* newNode = new Node(value);   // 1
        if (head == nullptr) {             // 2 ลิสต์ว่าง?
            head = newNode;                // 3
            return;                        // 4
        }
        Node* current = head;              // 5
        while (current->next != nullptr) { // 6 เดินไปท้าย
            current = current->next;       // 7
        }
        current->next = newNode;           // 8 โยงเข้า newNode
    }
};`,
  },
  insertAt: {
    title: 'insertAtPosition',
    fileName: 'll_insert_at.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedList {
private:
    Node* head;
public:
    LinkedList() : head(nullptr) {}

    // แทรกที่ตำแหน่ง pos (0-indexed)
    void insertAtPosition(int value, int pos) {
        if (pos == 0) { insertAtHead(value); return; }   // 1
        Node* newNode = new Node(value);                 // 2
        Node* current = head;                            // 3
        for (int i = 0; i < pos - 1 && current; i++) {   // 4
            current = current->next;                     // 5
        }
        if (!current) return;                            // 6
        newNode->next = current->next;                   // 7
        current->next = newNode;                         // 8
    }
};`,
  },
  deleteAt: {
    title: 'deleteAt',
    fileName: 'll_delete_at.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedList {
private:
    Node* head;
public:
    LinkedList() : head(nullptr) {}

    // ลบ Node ที่ตำแหน่ง pos
    void deleteAt(int pos) {
        if (head == nullptr || pos < 0) return;       // 1
        if (pos == 0) {                                // 2 ลบที่หัว
            Node* temp = head;                         // 3
            head = head->next;                         // 4
            delete temp;                               // 5
            return;                                    // 6
        }
        Node* prev = head;                             // 7
        for (int i = 0; i < pos - 1 && prev->next; i++) { // 8
            prev = prev->next;                         // 9
        }
        if (!prev->next) return;                       // 10
        Node* temp = prev->next;                       // 11
        prev->next = temp->next;                       // 12
        delete temp;                                   // 13
    }
};`,
  },
  search: {
    title: 'search',
    fileName: 'll_search.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedList {
private:
    Node* head;
public:
    LinkedList() : head(nullptr) {}

    int search(int value) {
        Node* current = head;                 // 1
        int index = 0;                        // 2
        while (current != nullptr) {          // 3
            if (current->data == value)       // 4
                return index;                 // 5
            current = current->next;          // 6
            index++;                          // 7
        }
        return -1;                            // 8
    }
};`,
  },
  traverse: {
    title: 'traverse',
    fileName: 'll_traverse.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedList {
private:
    Node* head;
public:
    LinkedList() : head(nullptr) {}

    void traverse() {
        Node* current = head;             // 1
        while (current != nullptr) {      // 2
            cout << current->data << " -> "; // 3
            current = current->next;      // 4
        }
        cout << "NULL" << endl;           // 5
    }
};`,
  },
};

// ---------- Stack — Array Implementation ----------

const CPP_STACK_ARRAY = {
  push: {
    title: 'push',
    fileName: 'arraystack_push.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class ArrayStack {
private:
    int arr[MAX];
    int top;
public:
    ArrayStack() : top(-1) {}

    // เพิ่มค่าลงบนสุดของสแต็ก
    void push(int value) {
        if (top >= MAX - 1) {            // 1 ตรวจ overflow
            cout << "Stack Overflow\\n";  // 2
            return;                       // 3
        }
        arr[++top] = value;               // 4 เพิ่ม top แล้วเก็บค่า
    }
};`,
  },
  pop: {
    title: 'pop',
    fileName: 'arraystack_pop.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class ArrayStack {
private:
    int arr[MAX];
    int top;
public:
    ArrayStack() : top(-1) {}

    // เอาค่าบนสุดออก
    int pop() {
        if (top < 0) {                          // 1 ตรวจ underflow
            cout << "Stack Underflow\\n";        // 2
            return -1;                          // 3
        }
        return arr[top--];                      // 4 คืนค่าที่ top แล้วลด top
    }
};`,
  },
  peek: {
    title: 'peek',
    fileName: 'arraystack_peek.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class ArrayStack {
private:
    int arr[MAX];
    int top;
public:
    ArrayStack() : top(-1) {}

    // ดูค่าบนสุดโดยไม่ลบ
    int peek() {
        if (top < 0) {                    // 1 ตรวจ underflow
            cout << "Stack is empty\\n";   // 2
            return -1;                    // 3
        }
        return arr[top];                  // 4 คืนค่าที่ top
    }
};`,
  },
};

// ---------- Stack — Pointer Implementation ----------

const CPP_STACK_POINTER = {
  push: {
    title: 'push',
    fileName: 'pointerstack_push.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class PointerStack {
private:
    Node* top;
public:
    PointerStack() : top(nullptr) {}

    // เพิ่ม Node ใหม่ที่ด้านบน
    void push(int value) {
        Node* newNode = new Node(value);   // 1 สร้าง Node ใหม่
        newNode->next = top;               // 2 ชี้ next ไปยัง top เดิม
        top = newNode;                     // 3 ย้าย top มาชี้ newNode
    }
};`,
  },
  pop: {
    title: 'pop',
    fileName: 'pointerstack_pop.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class PointerStack {
private:
    Node* top;
public:
    PointerStack() : top(nullptr) {}

    // เอา Node บนสุดออก
    int pop() {
        if (top == nullptr) {              // 1 ตรวจ underflow
            cout << "Stack Underflow\\n";   // 2
            return -1;                     // 3
        }
        Node* temp = top;                  // 4 เก็บ reference
        int val = temp->data;              // 5 อ่านค่า
        top = top->next;                   // 6 ย้าย top ลง
        delete temp;                       // 7 คืนหน่วยความจำ
        return val;                        // 8
    }
};`,
  },
  peek: {
    title: 'peek',
    fileName: 'pointerstack_peek.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class PointerStack {
private:
    Node* top;
public:
    PointerStack() : top(nullptr) {}

    // ดูค่าบนสุดโดยไม่ลบ
    int peek() {
        if (top == nullptr) {              // 1 ตรวจ empty
            cout << "Stack is empty\\n";    // 2
            return -1;                     // 3
        }
        return top->data;                  // 4 คืนค่าที่ top
    }
};`,
  },
};

// ---------- Queue — Array Implementation ----------

const CPP_QUEUE_ARRAY = {
  enqueue: {
    title: 'enqueue',
    fileName: 'arrayqueue_enqueue.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class ArrayQueue {
private:
    int arr[MAX];
    int front;
    int rear;
public:
    ArrayQueue() : front(0), rear(-1) {}

    // เพิ่มค่าที่ท้ายคิว (rear)
    void enqueue(int value) {
        if (rear >= MAX - 1) {            // 1 ตรวจ overflow
            cout << "Queue Overflow\\n";   // 2
            return;                       // 3
        }
        arr[++rear] = value;              // 4 เพิ่ม rear แล้วเก็บค่า
    }
};`,
  },
  dequeue: {
    title: 'dequeue',
    fileName: 'arrayqueue_dequeue.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class ArrayQueue {
private:
    int arr[MAX];
    int front;
    int rear;
public:
    ArrayQueue() : front(0), rear(-1) {}

    // เอาค่าหน้าสุดออก
    int dequeue() {
        if (front > rear) {                       // 1 ตรวจ underflow
            cout << "Queue Underflow\\n";          // 2
            return -1;                            // 3
        }
        return arr[front++];                      // 4 คืนค่าที่ front แล้วเพิ่ม front
    }
};`,
  },
  front: {
    title: 'front',
    fileName: 'arrayqueue_front.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class ArrayQueue {
private:
    int arr[MAX];
    int front;
    int rear;
public:
    ArrayQueue() : front(0), rear(-1) {}

    // ดูค่าหน้าสุดโดยไม่ลบ
    int frontElement() {
        if (front > rear) {                 // 1 ตรวจ underflow
            cout << "Queue is empty\\n";     // 2
            return -1;                      // 3
        }
        return arr[front];                  // 4 คืนค่าที่ front
    }
};`,
  },
};

// ---------- Queue — Pointer Implementation ----------

const CPP_QUEUE_POINTER = {
  enqueue: {
    title: 'enqueue',
    fileName: 'pointerqueue_enqueue.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class PointerQueue {
private:
    Node* front;
    Node* rear;
public:
    PointerQueue() : front(nullptr), rear(nullptr) {}

    // เพิ่ม Node ใหม่ที่ท้ายคิว
    void enqueue(int value) {
        Node* newNode = new Node(value);          // 1 สร้าง Node
        if (rear == nullptr) {                    // 2 คิวว่าง?
            front = rear = newNode;               // 3 front และ rear ชี้ที่เดียวกัน
            return;                               // 4
        }
        rear->next = newNode;                     // 5 โยง rear เดิมเข้า newNode
        rear = newNode;                           // 6 ย้าย rear ไป newNode
    }
};`,
  },
  dequeue: {
    title: 'dequeue',
    fileName: 'pointerqueue_dequeue.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class PointerQueue {
private:
    Node* front;
    Node* rear;
public:
    PointerQueue() : front(nullptr), rear(nullptr) {}

    // เอา Node หน้าสุดออก
    int dequeue() {
        if (front == nullptr) {              // 1 ตรวจ underflow
            cout << "Queue Underflow\\n";     // 2
            return -1;                       // 3
        }
        Node* temp = front;                  // 4 เก็บ reference
        int val = temp->data;                // 5 อ่านค่า
        front = front->next;                 // 6 ย้าย front ไป Node ถัดไป
        if (front == nullptr)                // 7 ถ้า front กลายเป็น nullptr
            rear = nullptr;                  // 8 ให้ rear เป็น nullptr ด้วย
        delete temp;                         // 9 คืนหน่วยความจำ
        return val;                          // 10
    }
};`,
  },
  front: {
    title: 'front',
    fileName: 'pointerqueue_front.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class PointerQueue {
private:
    Node* front;
    Node* rear;
public:
    PointerQueue() : front(nullptr), rear(nullptr) {}

    // ดูค่าหน้าสุดโดยไม่ลบ
    int frontElement() {
        if (front == nullptr) {              // 1 ตรวจ empty
            cout << "Queue is empty\\n";      // 2
            return -1;                       // 3
        }
        return front->data;                  // 4 คืนค่าที่ front
    }
};`,
  },
};

// ---------- Hash Table — Separate Chaining ----------

const CPP_HASH_CHAINING = {
  insert: {
    title: 'insert',
    fileName: 'hash_chaining_insert.cpp',
    code: `#include <iostream>
using namespace std;

const int SIZE = 11;

struct Node {
    int key;
    int value;
    Node* next;
    Node(int k, int v) : key(k), value(v), next(nullptr) {}
};

class HashTableChaining {
private:
    Node* table[SIZE];
    int hash(int key) { return key % SIZE; }       // 0
public:
    HashTableChaining() { for (int i = 0; i < SIZE; i++) table[i] = nullptr; }

    void insert(int key, int value) {
        int idx = hash(key);                  // 1 คำนวณ hash
        Node* cur = table[idx];               // 2 เริ่มที่ head ของ chain
        while (cur != nullptr) {              // 3 วนตรวจ chain
            if (cur->key == key) {            // 4 พบ key ซ้ำ?
                cur->value = value;           // 5 อัปเดต value
                return;                       // 6
            }
            cur = cur->next;                  // 7 ไป node ถัดไป
        }
        Node* node = new Node(key, value);    // 8 สร้าง node ใหม่
        node->next = table[idx];              // 9 โยงเข้า head เดิม
        table[idx] = node;                    // 10 ย้าย head
    }
};`,
  },
  search: {
    title: 'search',
    fileName: 'hash_chaining_search.cpp',
    code: `#include <iostream>
using namespace std;

const int SIZE = 11;

struct Node { int key; int value; Node* next; Node(int k, int v) : key(k), value(v), next(nullptr) {} };

class HashTableChaining {
private:
    Node* table[SIZE];
    int hash(int key) { return key % SIZE; }
public:
    HashTableChaining() { for (int i = 0; i < SIZE; i++) table[i] = nullptr; }

    bool search(int key, int& outValue) {
        int idx = hash(key);                  // 1 คำนวณ hash
        Node* cur = table[idx];               // 2 เริ่มที่ head ของ chain
        while (cur != nullptr) {              // 3 วนตรวจ
            if (cur->key == key) {            // 4 พบ?
                outValue = cur->value;        // 5 เก็บ value
                return true;                  // 6 คืน true
            }
            cur = cur->next;                  // 7 ไปถัดไป
        }
        return false;                         // 8 ไม่พบ
    }
};`,
  },
  delete: {
    title: 'delete',
    fileName: 'hash_chaining_delete.cpp',
    code: `#include <iostream>
using namespace std;

const int SIZE = 11;

struct Node { int key; int value; Node* next; Node(int k, int v) : key(k), value(v), next(nullptr) {} };

class HashTableChaining {
private:
    Node* table[SIZE];
    int hash(int key) { return key % SIZE; }
public:
    HashTableChaining() { for (int i = 0; i < SIZE; i++) table[i] = nullptr; }

    void remove(int key) {
        int idx = hash(key);                  // 1 คำนวณ hash
        Node* cur = table[idx];               // 2 เริ่มที่ head
        Node* prev = nullptr;                 // 3 prev = nullptr
        while (cur != nullptr) {              // 4 วนตรวจ
            if (cur->key == key) {            // 5 พบ?
                if (prev) prev->next = cur->next; // 6 โยงข้าม cur
                else table[idx] = cur->next;  // 7 ลบที่ head
                delete cur;                   // 8 คืนหน่วยความจำ
                return;                       // 9
            }
            prev = cur;                       // 10 เลื่อน prev
            cur = cur->next;                  // 11 เลื่อน cur
        }
    }
};`,
  },
};

// ---------- Hash Table — Linear Probing ----------

const CPP_HASH_LINEAR = {
  insert: {
    title: 'insert',
    fileName: 'hash_linear_insert.cpp',
    code: `#include <iostream>
using namespace std;

const int SIZE = 11;
const int EMPTY = -1;

class HashTableLinear {
private:
    int keys[SIZE];
    int values[SIZE];
    bool used[SIZE];
    int hash(int key) { return key % SIZE; }
public:
    HashTableLinear() { for (int i = 0; i < SIZE; i++) used[i] = false; }

    void insert(int key, int value) {
        int h = hash(key);                    // 1 คำนวณ hash
        for (int i = 0; i < SIZE; i++) {      // 2 ลอง probe
            int idx = (h + i) % SIZE;         // 3 linear: (h+i) % SIZE
            if (!used[idx]) {                 // 4 ช่องว่าง?
                keys[idx] = key;              // 5 เก็บ key
                values[idx] = value;          // 6 เก็บ value
                used[idx] = true;             // 7 ทำเครื่องหมาย
                return;                       // 8 สำเร็จ
            }
            if (keys[idx] == key) {           // 9 key ซ้ำ?
                values[idx] = value;          // 10 อัปเดต
                return;                       // 11
            }
        }
        cout << "Table Full\\n";              // 12 เต็ม
    }
};`,
  },
  search: {
    title: 'search',
    fileName: 'hash_linear_search.cpp',
    code: `#include <iostream>
using namespace std;

const int SIZE = 11;

class HashTableLinear {
private:
    int keys[SIZE]; int values[SIZE]; bool used[SIZE];
    int hash(int key) { return key % SIZE; }
public:
    HashTableLinear() { for (int i = 0; i < SIZE; i++) used[i] = false; }

    bool search(int key, int& outValue) {
        int h = hash(key);                    // 1 คำนวณ hash
        for (int i = 0; i < SIZE; i++) {      // 2 probe
            int idx = (h + i) % SIZE;         // 3 (h+i) % SIZE
            if (!used[idx]) return false;     // 4 ช่องว่าง → ไม่พบ
            if (keys[idx] == key) {           // 5 พบ key?
                outValue = values[idx];       // 6 เก็บ value
                return true;                  // 7 คืน true
            }
        }
        return false;                         // 8 probe ครบ → ไม่พบ
    }
};`,
  },
  delete: {
    title: 'delete',
    fileName: 'hash_linear_delete.cpp',
    code: `#include <iostream>
using namespace std;

const int SIZE = 11;

class HashTableLinear {
private:
    int keys[SIZE]; int values[SIZE];
    bool used[SIZE]; bool deleted[SIZE];
    int hash(int key) { return key % SIZE; }
public:
    HashTableLinear() { for (int i = 0; i < SIZE; i++) { used[i] = false; deleted[i] = false; } }

    void remove(int key) {
        int h = hash(key);                    // 1 คำนวณ hash
        for (int i = 0; i < SIZE; i++) {      // 2 probe
            int idx = (h + i) % SIZE;         // 3 (h+i) % SIZE
            if (!used[idx]) return;           // 4 ช่องว่าง → ไม่พบ
            if (!deleted[idx] && keys[idx] == key) {  // 5 พบ key?
                deleted[idx] = true;          // 6 mark เป็น tombstone
                return;                       // 7 (ไม่ลบจริง เพื่อรักษา probe chain)
            }
        }
    }
};`,
  },
};

// ---------- Hash Table — Quadratic Probing ----------

const CPP_HASH_QUADRATIC = {
  insert: {
    title: 'insert',
    fileName: 'hash_quadratic_insert.cpp',
    code: `#include <iostream>
using namespace std;

const int SIZE = 11;

class HashTableQuadratic {
private:
    int keys[SIZE]; int values[SIZE]; bool used[SIZE];
    int hash(int key) { return key % SIZE; }
public:
    HashTableQuadratic() { for (int i = 0; i < SIZE; i++) used[i] = false; }

    void insert(int key, int value) {
        int h = hash(key);                          // 1 คำนวณ hash
        for (int i = 0; i < SIZE; i++) {            // 2 probe
            int idx = (h + i * i) % SIZE;           // 3 quadratic: (h+i²) % SIZE
            if (!used[idx]) {                       // 4 ช่องว่าง?
                keys[idx] = key;                    // 5
                values[idx] = value;                // 6
                used[idx] = true;                   // 7
                return;                             // 8
            }
            if (keys[idx] == key) {                 // 9 key ซ้ำ?
                values[idx] = value;                // 10
                return;                             // 11
            }
        }
        cout << "Table Full\\n";                    // 12
    }
};`,
  },
  search: {
    title: 'search',
    fileName: 'hash_quadratic_search.cpp',
    code: `#include <iostream>
using namespace std;

const int SIZE = 11;

class HashTableQuadratic {
private:
    int keys[SIZE]; int values[SIZE]; bool used[SIZE];
    int hash(int key) { return key % SIZE; }
public:
    HashTableQuadratic() { for (int i = 0; i < SIZE; i++) used[i] = false; }

    bool search(int key, int& outValue) {
        int h = hash(key);                          // 1
        for (int i = 0; i < SIZE; i++) {            // 2
            int idx = (h + i * i) % SIZE;           // 3 (h+i²) % SIZE
            if (!used[idx]) return false;           // 4 ช่องว่าง → ไม่พบ
            if (keys[idx] == key) {                 // 5 พบ?
                outValue = values[idx];             // 6
                return true;                        // 7
            }
        }
        return false;                               // 8
    }
};`,
  },
  delete: {
    title: 'delete',
    fileName: 'hash_quadratic_delete.cpp',
    code: `#include <iostream>
using namespace std;

const int SIZE = 11;

class HashTableQuadratic {
private:
    int keys[SIZE]; int values[SIZE];
    bool used[SIZE]; bool deleted[SIZE];
    int hash(int key) { return key % SIZE; }
public:
    HashTableQuadratic() { for (int i = 0; i < SIZE; i++) { used[i] = false; deleted[i] = false; } }

    void remove(int key) {
        int h = hash(key);                          // 1
        for (int i = 0; i < SIZE; i++) {            // 2
            int idx = (h + i * i) % SIZE;           // 3 (h+i²) % SIZE
            if (!used[idx]) return;                 // 4 ช่องว่าง → ไม่พบ
            if (!deleted[idx] && keys[idx] == key) { // 5 พบ?
                deleted[idx] = true;                // 6 mark tombstone
                return;                             // 7
            }
        }
    }
};`,
  },
};

// ---------- Hash Table — Double Hashing ----------

const CPP_HASH_DOUBLE = {
  insert: {
    title: 'insert',
    fileName: 'hash_double_insert.cpp',
    code: `#include <iostream>
using namespace std;

const int SIZE = 11;

class HashTableDouble {
private:
    int keys[SIZE]; int values[SIZE]; bool used[SIZE];
    int hash1(int key) { return key % SIZE; }       // h1
    int hash2(int key) { return 7 - (key % 7); }    // h2 (never 0)
public:
    HashTableDouble() { for (int i = 0; i < SIZE; i++) used[i] = false; }

    void insert(int key, int value) {
        int h = hash1(key);                         // 1 h1
        int step = hash2(key);                      // 2 h2 (step size)
        for (int i = 0; i < SIZE; i++) {            // 3 probe
            int idx = (h + i * step) % SIZE;        // 4 (h1 + i·h2) % SIZE
            if (!used[idx]) {                       // 5 ช่องว่าง?
                keys[idx] = key;                    // 6
                values[idx] = value;                // 7
                used[idx] = true;                   // 8
                return;                             // 9
            }
            if (keys[idx] == key) {                 // 10 ซ้ำ?
                values[idx] = value;                // 11
                return;                             // 12
            }
        }
        cout << "Table Full\\n";                    // 13
    }
};`,
  },
  search: {
    title: 'search',
    fileName: 'hash_double_search.cpp',
    code: `#include <iostream>
using namespace std;

const int SIZE = 11;

class HashTableDouble {
private:
    int keys[SIZE]; int values[SIZE]; bool used[SIZE];
    int hash1(int key) { return key % SIZE; }
    int hash2(int key) { return 7 - (key % 7); }
public:
    HashTableDouble() { for (int i = 0; i < SIZE; i++) used[i] = false; }

    bool search(int key, int& outValue) {
        int h = hash1(key);                         // 1
        int step = hash2(key);                      // 2
        for (int i = 0; i < SIZE; i++) {            // 3
            int idx = (h + i * step) % SIZE;        // 4 (h1 + i·h2) % SIZE
            if (!used[idx]) return false;           // 5 ช่องว่าง → ไม่พบ
            if (keys[idx] == key) {                 // 6 พบ?
                outValue = values[idx];             // 7
                return true;                        // 8
            }
        }
        return false;                               // 9
    }
};`,
  },
  delete: {
    title: 'delete',
    fileName: 'hash_double_delete.cpp',
    code: `#include <iostream>
using namespace std;

const int SIZE = 11;

class HashTableDouble {
private:
    int keys[SIZE]; int values[SIZE];
    bool used[SIZE]; bool deleted[SIZE];
    int hash1(int key) { return key % SIZE; }
    int hash2(int key) { return 7 - (key % 7); }
public:
    HashTableDouble() { for (int i = 0; i < SIZE; i++) { used[i] = false; deleted[i] = false; } }

    void remove(int key) {
        int h = hash1(key);                         // 1
        int step = hash2(key);                      // 2
        for (int i = 0; i < SIZE; i++) {            // 3
            int idx = (h + i * step) % SIZE;        // 4 (h1 + i·h2) % SIZE
            if (!used[idx]) return;                 // 5 ช่องว่าง → ไม่พบ
            if (!deleted[idx] && keys[idx] == key) { // 6 พบ?
                deleted[idx] = true;                // 7 mark tombstone
                return;                             // 8
            }
        }
    }
};`,
  },
};

// ---------- Binary Heap / Priority Queue (Min-Heap) ----------

const CPP_HEAP = {
  insert: {
    title: 'insert (heapify-up)',
    fileName: 'heap_insert.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class MinHeap {
private:
    int arr[MAX];
    int size;
    int parent(int i) { return (i - 1) / 2; }
public:
    MinHeap() : size(0) {}

    void insert(int value) {
        if (size >= MAX) return;             // 1 เช็ค full
        arr[size] = value;                   // 2 ใส่ท้าย array
        int i = size++;                      // 3 size++
        while (i > 0 && arr[i] < arr[parent(i)]) {  // 4 heapify-up
            swap(arr[i], arr[parent(i)]);    // 5 สลับกับ parent
            i = parent(i);                   // 6 ขยับ i ขึ้น
        }
    }
};`,
  },
  extractMin: {
    title: 'extractMin (heapify-down)',
    fileName: 'heap_extract.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class MinHeap {
private:
    int arr[MAX];
    int size;
    int left(int i) { return 2 * i + 1; }
    int right(int i) { return 2 * i + 2; }
public:
    MinHeap() : size(0) {}

    int extractMin() {
        if (size == 0) return -1;            // 1 underflow
        int min = arr[0];                    // 2 เก็บ root (min)
        arr[0] = arr[--size];                // 3 ย้าย last → root
        int i = 0;
        while (true) {                       // 4 heapify-down
            int l = left(i), r = right(i);   // 5
            int smallest = i;                // 6
            if (l < size && arr[l] < arr[smallest]) smallest = l;  // 7
            if (r < size && arr[r] < arr[smallest]) smallest = r;  // 8
            if (smallest == i) break;        // 9 หยุดถ้าเรียงแล้ว
            swap(arr[i], arr[smallest]);     // 10 สลับลง
            i = smallest;                    // 11
        }
        return min;                          // 12 คืน min
    }
};`,
  },
};

// ---------- Disjoint Set Union (Union-Find) ----------

const CPP_DSU = {
  find: {
    title: 'find (path compression)',
    fileName: 'dsu_find.cpp',
    code: `#include <iostream>
using namespace std;

const int N = 100;
int parent[N];

// find แบบ path compression — O(α(N)) ~ O(1)
int find(int x) {
    if (parent[x] != x) {                   // 1 ถ้าไม่ใช่ root
        parent[x] = find(parent[x]);        // 2 path compression
    }
    return parent[x];                       // 3 คืน root
}

// แบบ iterative:
// int find(int x) {
//     while (parent[x] != x) {              // 1 ไล่ขึ้น parent
//         parent[x] = parent[parent[x]];   // 2 path halving
//         x = parent[x];                   // 3
//     }
//     return x;                            // 4 คืน root
// }`,
  },
  union_: {
    title: 'union (by rank)',
    fileName: 'dsu_union.cpp',
    code: `#include <iostream>
using namespace std;

const int N = 100;
int parent[N], rnk[N];

int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);
    return parent[x];
}

// union by rank — ต้ไม้ที่สั้นกว่าไปอยู่ใต้ต้นไม้ที่สูงกว่า
bool unite(int x, int y) {
    int rx = find(x);                       // 1 root ของ x
    int ry = find(y);                       // 2 root ของ y
    if (rx == ry) return false;             // 3 อยู่ใน set เดียวกัน
    if (rnk[rx] < rnk[ry]) {                // 4 rank เล็ก → ไปใต้ใหญ่
        parent[rx] = ry;                    // 5
    } else if (rnk[rx] > rnk[ry]) {         // 6
        parent[ry] = rx;                    // 7
    } else {                                // 8 เท่ากัน
        parent[ry] = rx;                    // 9 เลือกฝั่งนึง
        rnk[rx]++;                          // 10 bump rank
    }
    return true;                            // 11 รวมสำเร็จ
}`,
  },
};

// ---------- Dijkstra's Shortest Path ----------

const CPP_DIJKSTRA = {
  dijkstra: {
    title: 'dijkstra',
    fileName: 'dijkstra.cpp',
    code: `#include <iostream>
#include <vector>
#include <climits>
using namespace std;

const int N = 100;
vector<pair<int,int>> adj[N];   // adj[u] = list of {v, weight}
int dist[N];
bool visited[N];

void dijkstra(int source) {
    for (int i = 0; i < N; i++) {            // 1 init
        dist[i] = INT_MAX;                   // 2
        visited[i] = false;                  // 3
    }
    dist[source] = 0;                        // 4

    for (int cnt = 0; cnt < N; cnt++) {      // 5 ทำ N รอบ
        // หา unvisited ที่ dist น้อยสุด
        int u = -1, minD = INT_MAX;          // 6
        for (int i = 0; i < N; i++) {        // 7
            if (!visited[i] && dist[i] < minD) {  // 8
                minD = dist[i]; u = i;       // 9
            }
        }
        if (u == -1) break;                  // 10 ไม่มีที่ไปต่อ
        visited[u] = true;                   // 11 mark visited

        // relax ทุก edge จาก u
        for (auto& [v, w] : adj[u]) {        // 12 วน neighbors
            if (visited[v]) continue;        // 13 ข้าม visited
            if (dist[u] + w < dist[v]) {     // 14 พบทางสั้นกว่า?
                dist[v] = dist[u] + w;       // 15 อัปเดต dist
            }
        }
    }
}`,
  },
};

// ---------- MST (Prim + Kruskal) ----------

const CPP_MST = {
  prim: {
    title: 'prim',
    fileName: 'mst_prim.cpp',
    code: `#include <iostream>
#include <vector>
#include <climits>
using namespace std;

const int N = 100;
vector<pair<int,int>> adj[N];
int key[N], parent[N];
bool inMST[N];

void prim(int source) {
    for (int i = 0; i < N; i++) {            // init
        key[i] = INT_MAX;
        inMST[i] = false;
        parent[i] = -1;
    }
    key[source] = 0;

    for (int cnt = 0; cnt < N; cnt++) {      // ทำ N รอบ
        int u = -1, minK = INT_MAX;          // หา min key ที่ยังไม่อยู่ใน MST
        for (int i = 0; i < N; i++) {
            if (!inMST[i] && key[i] < minK) {
                minK = key[i]; u = i;
            }
        }
        if (u == -1) break;
        inMST[u] = true;                     // เพิ่ม u ใน MST

        for (auto& [v, w] : adj[u]) {        // วน neighbors
            if (!inMST[v] && w < key[v]) {   // edge เบากว่า?
                key[v] = w;                  // อัปเดต key
                parent[v] = u;               // บันทึก parent
            }
        }
    }
}`,
  },
  kruskal: {
    title: 'kruskal',
    fileName: 'mst_kruskal.cpp',
    code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

const int N = 100;
int parent[N], rnk[N];

int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);
    return parent[x];
}

bool unite(int x, int y) {
    int rx = find(x), ry = find(y);
    if (rx == ry) return false;
    if (rnk[rx] < rnk[ry]) parent[rx] = ry;
    else if (rnk[rx] > rnk[ry]) parent[ry] = rx;
    else { parent[ry] = rx; rnk[rx]++; }
    return true;
}

// edges = list of {weight, u, v}
int kruskal(int n, vector<tuple<int,int,int>>& edges) {
    sort(edges.begin(), edges.end());        // เรียงตาม weight
    for (int i = 0; i < n; i++) { parent[i] = i; rnk[i] = 0; } // init DSU

    int total = 0, count = 0;
    for (auto& [w, u, v] : edges) {          // วนแต่ละ edge
        if (find(u) != find(v)) {            // ไม่เกิด cycle?
            unite(u, v);                     // รวม set
            total += w;                      // บวก weight
            count++;
            if (count == n - 1) break;       // MST ครบ n-1 edges
        }
    }
    return total;                            // คืน total weight
}`,
  },
};

// ---------- Graph Traversal (BFS + DFS) ----------

const CPP_TRAVERSAL = {
  bfs: {
    title: 'bfs',
    fileName: 'bfs.cpp',
    code: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

const int N = 100;
vector<int> adj[N];
bool visited[N];

// BFS ใช้ queue (FIFO) — เยี่ยมเป็นชั้น ๆ (level by level)
void bfs(int source) {
    queue<int> q;                          // 1 สร้าง queue
    q.push(source);                        // 2 enqueue source
    visited[source] = true;                // 3 mark visited

    while (!q.empty()) {                   // 4 ลูปจนกว่า queue ว่าง
        int u = q.front();                 // 5 ดูตัวหน้า queue
        q.pop();                           // 6 dequeue
        cout << u << " ";                  // 7 ประมวลผล u

        for (int v : adj[u]) {             // 8 วนเพื่อนบ้านทุกตัว
            if (!visited[v]) {             // 9 ถ้ายังไม่ visited
                visited[v] = true;         // 10 mark visited
                q.push(v);                 // 11 enqueue
            }
        }
    }
}`,
  },
  dfs: {
    title: 'dfs',
    fileName: 'dfs.cpp',
    code: `#include <iostream>
#include <vector>
using namespace std;

const int N = 100;
vector<int> adj[N];
bool visited[N];

// DFS แบบ iterative ใช้ stack (LIFO) — ดำลึงเป็น branch
void dfs(int source) {
    vector<int> st;                        // 1 สร้าง stack
    st.push_back(source);                  // 2 push source

    while (!st.empty()) {                  // 3 ลูปจนกว่า stack ว่าง
        int u = st.back();                 // 4 ดูตัวบนสุด
        st.pop_back();                     // 5 pop

        if (visited[u]) continue;          // 6 ถ้า visited แล้ว ข้าม
        visited[u] = true;                 // 7 mark visited
        cout << u << " ";                  // 8 ประมวลผล u

        // push เพื่อนบ้าน (ย้อนลำดับเพื่อให้เยี่ยมเล็กก่อน)
        for (int i = adj[u].size() - 1; i >= 0; i--) {  // 9
            int v = adj[u][i];             // 10
            if (!visited[v]) {             // 11
                st.push_back(v);           // 12 push
            }
        }
    }
}

// แบบ recursive (กระชับกว่า แต่ใช้ call stack):
// void dfs(int u) {
//     visited[u] = true;                   // 1 mark visited
//     cout << u << " ";                    // 2 ประมวลผล
//     for (int v : adj[u]) {               // 3 วนเพื่อนบ้าน
//         if (!visited[v]) dfs(v);         // 4 recurse
//     }
// }`,
  },
};

// ---------- Topological Sort (Kahn's Algorithm) ----------

const CPP_TOPO = {
  topo: {
    title: 'topologicalSort',
    fileName: 'topological_sort.cpp',
    code: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

const int N = 100;
vector<int> adj[N];
int inDegree[N];

// Topological Sort แบบ Kahn — ใช้ queue + ลด in-degree
vector<int> topologicalSort(int n) {
    queue<int> q;
    for (int i = 0; i < n; i++) {            // 1 หา in-degree ของทุก node
        if (inDegree[i] == 0) q.push(i);     // 2 ใส่ in-deg=0 ลง queue
    }

    vector<int> order;
    while (!q.empty()) {                      // 3 ลูปจนกว่า queue ว่าง
        int u = q.front(); q.pop();           // 4 dequeue
        order.push_back(u);                   // 5 เพิ่มเข้า result

        for (int v : adj[u]) {                // 6 วนเพื่อนบ้าน
            if (--inDegree[v] == 0) {         // 7 ลด in-degree, ถ้าเป็น 0
                q.push(v);                    // 8 enqueue
            }
        }
    }

    // ถ้า order.size() < n → มี cycle (ไม่ใช่ DAG)
    return order;                             // 9 คืน topological order
}`,
  },
};

// ---------- Bellman-Ford (handles negative weights) ----------

const CPP_BELLMAN_FORD = {
  bellmanFord: {
    title: 'bellmanFord',
    fileName: 'bellman_ford.cpp',
    code: `#include <iostream>
#include <vector>
#include <climits>
using namespace std;

const int N = 100;
const int E = 200;
int u[E], v[E], w[E];   // edge list
long long dist[N];

// Bellman-Ford — รองรับ negative weights + ตรวจ negative cycle
bool bellmanFord(int n, int m, int source) {
    for (int i = 0; i < n; i++) dist[i] = LLONG_MAX;  // 1 init dist
    dist[source] = 0;                                  // 2

    // V-1 iterations (relax ทุก edge)
    for (int iter = 0; iter < n - 1; iter++) {         // 3 วน V-1 ครั้ง
        for (int j = 0; j < m; j++) {                  // 4 วนทุก edge
            if (dist[u[j]] != LLONG_MAX &&             // 5 ถ้า source มีค่า
                dist[u[j]] + w[j] < dist[v[j]]) {      // 6 พบทางสั้นกว่า?
                dist[v[j]] = dist[u[j]] + w[j];        // 7 relax
            }
        }
    }

    // รอบที่ V — ตรวจ negative cycle
    for (int j = 0; j < m; j++) {                      // 8 วนทุก edge อีกครั้ง
        if (dist[u[j]] != LLONG_MAX &&                 // 9 ถ้ายัง relax ได้อีก
            dist[u[j]] + w[j] < dist[v[j]]) {
            return false;                              // 10 พบ negative cycle!
        }
    }
    return true;                                       // 11 ไม่มี cycle, dist ถูกต้อง
}`,
  },
};

// ---------- A* Search (heuristic-guided) ----------

const CPP_ASTAR = {
  astar: {
    title: 'aStar',
    fileName: 'astar.cpp',
    code: `#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

const int N = 100;
vector<pair<int,int>> adj[N];  // adj[u] = {v, w}
int h[N];                       // heuristic: estimate cost to goal
long long g[N];                 // g(n): cost from source to n
long long f[N];                 // f(n) = g(n) + h(n)

// A* ใช้ priority queue เรียงตาม f(n) น้อยสุด
// หา shortest path จาก source → goal (ใช้ heuristic เร่งการค้น)
vector<int> aStar(int source, int goal, int n) {
    for (int i = 0; i < n; i++) {               // 1 init g, f
        g[i] = LLONG_MAX;                        // 2
        f[i] = LLONG_MAX;                        // 3
    }
    g[source] = 0;                               // 4
    f[source] = h[source];                       // 5 f = g + h

    // priority queue: (f, node) เรียง f น้อยสุดก่อน
    priority_queue<pair<long long,int>,          // 6
                   vector<pair<long long,int>>,
                   greater<>> pq;
    pq.push({f[source], source});                // 7 push source
    vector<int> parent(n, -1);
    vector<bool> closed(n, false);

    while (!pq.empty()) {                        // 8
        auto [fu, u] = pq.top(); pq.pop();       // 9 pop f น้อยสุด
        if (u == goal) break;                    // 10 ถึง goal → หยุด
        if (closed[u]) continue;                 // 11 ข้ามถ้า closed แล้ว
        closed[u] = true;                        // 12 mark closed

        for (auto& [v, w] : adj[u]) {            // 13 วนเพื่อนบ้าน
            if (closed[v]) continue;             // 14
            long long tentativeG = g[u] + w;     // 15 คำนวณ g ใหม่
            if (tentativeG < g[v]) {             // 16 ดีกว่า?
                parent[v] = u;                   // 17 บันทึก parent
                g[v] = tentativeG;               // 18 อัปเดต g
                f[v] = g[v] + h[v];              // 19 อัปเดต f
                pq.push({f[v], v});              // 20 push ลง pq
            }
        }
    }

    // reconstruct path
    vector<int> path;
    for (int cur = goal; cur != -1; cur = parent[cur])  // 21 ไล่ parent
        path.push_back(cur);
    reverse(path.begin(), path.end());          // 22 กลับด้าน
    return path;                                // 23 คืน path
}`,
  },
};

// ---------- Floyd-Warshall (All-Pairs Shortest Path) ----------

const CPP_FLOYD_WARSHALL = {
  floydWarshall: {
    title: 'floydWarshall',
    fileName: 'floyd_warshall.cpp',
    code: `#include <iostream>
#include <climits>
using namespace std;

const int N = 100;
long long dist[N][N];

void floydWarshall(int n) {
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (dist[i][k] != LLONG_MAX && dist[k][j] != LLONG_MAX
                    && dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];

    for (int i = 0; i < n; i++)
        if (dist[i][i] < 0) { cout << "Negative cycle!\\n"; return; }
}`,
  },
};

// ---------- Tarjan's SCC ----------

const CPP_TARJAN_SCC = {
  tarjan: {
    title: 'tarjanSCC',
    fileName: 'tarjan_scc.cpp',
    code: `#include <iostream>
#include <vector>
#include <stack>
using namespace std;

vector<int> adj[100];
int idx[100], low[100], timer = 0;
bool onStack[100];
stack<int> st;
vector<vector<int>> sccs;

void strongconnect(int v) {
    idx[v] = low[v] = timer++;
    st.push(v); onStack[v] = true;
    for (int w : adj[v]) {
        if (idx[w] == -1) { strongconnect(w); low[v] = min(low[v], low[w]); }
        else if (onStack[w]) low[v] = min(low[v], idx[w]);
    }
    if (low[v] == idx[v]) {
        vector<int> scc; int w;
        do { w = st.top(); st.pop(); onStack[w] = false; scc.push_back(w); } while (w != v);
        sccs.push_back(scc);
    }
}`,
  },
};

// ---------- AVL Tree ----------

const CPP_AVL = {
  insert: {
    title: 'avlInsert',
    fileName: 'avl_tree.cpp',
    code: `#include <algorithm>
using namespace std;

struct Node { int value; Node* left; Node* right; int height; };
int height(Node* n) { return n ? n->height : 0; }
int balance(Node* n) { return n ? height(n->left) - height(n->right) : 0; }

Node* rotateRight(Node* y) {
    Node* x = y->left; y->left = x->right; x->right = y;
    y->height = 1 + max(height(y->left), height(y->right));
    x->height = 1 + max(height(x->left), height(x->right));
    return x;
}
Node* rotateLeft(Node* x) {
    Node* y = x->right; x->right = y->left; y->left = x;
    x->height = 1 + max(height(x->left), height(x->right));
    y->height = 1 + max(height(y->left), height(y->right));
    return y;
}

Node* insert(Node* node, int v) {
    if (!node) return new Node{v, nullptr, nullptr, 1};
    if (v < node->value) node->left = insert(node->left, v);
    else if (v > node->value) node->right = insert(node->right, v);
    else return node;
    node->height = 1 + max(height(node->left), height(node->right));
    int bf = balance(node);
    if (bf > 1 && v < node->left->value) return rotateRight(node);
    if (bf < -1 && v > node->right->value) return rotateLeft(node);
    if (bf > 1 && v > node->left->value) { node->left = rotateLeft(node->left); return rotateRight(node); }
    if (bf < -1 && v < node->right->value) { node->right = rotateRight(node->right); return rotateLeft(node); }
    return node;
}`,
  },
};

// ---------- Red-Black Tree ----------

const CPP_RB_TREE = {
  insert: {
    title: 'rbInsert',
    fileName: 'red_black_tree.cpp',
    code: `using namespace std;
enum Color { RED, BLACK };
struct Node { int value; Color color; Node* left; Node* right; Node* parent; };

void rotateLeft(Node*& root, Node* x) {
    Node* y = x->right; x->right = y->left;
    if (y->left) y->left->parent = x;
    y->parent = x->parent;
    if (!x->parent) root = y;
    else if (x == x->parent->left) x->parent->left = y;
    else x->parent->right = y;
    y->left = x; x->parent = y;
}
void rotateRight(Node*& root, Node* x) {
    Node* y = x->left; x->left = y->right;
    if (y->right) y->right->parent = x;
    y->parent = x->parent;
    if (!x->parent) root = y;
    else if (x == x->parent->right) x->parent->right = y;
    else x->parent->left = y;
    y->right = x; x->parent = y;
}

void fixInsert(Node*& root, Node* z) {
    while (z->parent && z->parent->color == RED) {
        Node* gp = z->parent->parent;
        if (z->parent == gp->left) {
            Node* u = gp->right;
            if (u && u->color == RED) { z->parent->color = BLACK; u->color = BLACK; gp->color = RED; z = gp; }
            else {
                if (z == z->parent->right) { z = z->parent; rotateLeft(root, z); }
                z->parent->color = BLACK; gp->color = RED; rotateRight(root, gp);
            }
        } else {
            Node* u = gp->left;
            if (u && u->color == RED) { z->parent->color = BLACK; u->color = BLACK; gp->color = RED; z = gp; }
            else {
                if (z == z->parent->left) { z = z->parent; rotateRight(root, z); }
                z->parent->color = BLACK; gp->color = RED; rotateLeft(root, gp);
            }
        }
    }
    root->color = BLACK;
}`,
  },
};

// ---------- Johnson's Algorithm (All-Pairs Shortest Path with negative edges) ----------

const CPP_JOHNSON = {
  johnson: {
    title: 'johnson',
    fileName: 'johnson.cpp',
    code: `#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

const int N = 100;
const long long INF = LLONG_MAX;
vector<pair<int,long long>> adj[N];  // original graph
vector<pair<int,long long>> radj[N]; // reweighted graph
long long h[N];          // Bellman-Ford distances from virtual source
long long dist[N][N];    // final all-pairs shortest paths

// Bellman-Ford from virtual source S (connected to all nodes with w=0)
bool bellmanFord(int n) {
    for (int i = 0; i < n; i++) h[i] = INF;
    h[n] = 0;  // virtual source S = node n

    // V+1 iterations (V real nodes + 1 virtual)
    for (int iter = 0; iter < n; iter++) {
        // Virtual edges S → i (weight 0)
        for (int i = 0; i < n; i++) {
            if (h[n] + 0 < h[i]) h[i] = h[n] + 0;
        }
        // Original edges
        for (int u = 0; u < n; u++) {
            if (h[u] == INF) continue;
            for (auto& [v, w] : adj[u]) {
                if (h[u] + w < h[v]) h[v] = h[u] + w;
            }
        }
    }

    // Check negative cycle
    for (int u = 0; u < n; u++) {
        if (h[u] == INF) continue;
        for (auto& [v, w] : adj[u]) {
            if (h[u] + w < h[v]) return false;  // negative cycle!
        }
    }
    return true;
}

// Dijkstra from source s using reweighted edges
void dijkstra(int s, int n) {
    for (int i = 0; i < n; i++) dist[s][i] = INF;
    dist[s][s] = 0;
    priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
    pq.push({0, s});

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[s][u]) continue;
        for (auto& [v, w] : radj[u]) {
            if (dist[s][u] + w < dist[s][v]) {
                dist[s][v] = dist[s][u] + w;
                pq.push({dist[s][v], v});
            }
        }
    }
}

// Johnson's Algorithm: all-pairs shortest path (รองรับ negative edges)
bool johnson(int n) {
    // เฟส 1: Bellman-Ford จาก virtual source S
    if (!bellmanFord(n)) return false;  // negative cycle

    // เฟส 2: Reweight edges: w'(u,v) = w(u,v) + h(u) - h(v) ≥ 0
    for (int u = 0; u < n; u++) {
        for (auto& [v, w] : adj[u]) {
            long long newW = w + h[u] - h[v];
            radj[u].push_back({v, newW});
        }
    }

    // เฟส 3: Dijkstra จากทุก node + ปรับกลับ
    for (int s = 0; s < n; s++) {
        dijkstra(s, n);
        // ปรับกลับ: dist(u,v) = dist'(u,v) - h(u) + h(v)
        for (int v = 0; v < n; v++) {
            if (dist[s][v] != INF) {
                dist[s][v] = dist[s][v] - h[s] + h[v];
            }
        }
    }
    return true;
}`,
  },
};

// Export
window.CPP_SOURCES = {
  LL_ARRAY: CPP_LL_ARRAY,
  LL_POINTER: CPP_LL_POINTER,
  STACK_ARRAY: CPP_STACK_ARRAY,
  STACK_POINTER: CPP_STACK_POINTER,
  QUEUE_ARRAY: CPP_QUEUE_ARRAY,
  QUEUE_POINTER: CPP_QUEUE_POINTER,
  HASH_CHAINING: CPP_HASH_CHAINING,
  HASH_LINEAR: CPP_HASH_LINEAR,
  HASH_QUADRATIC: CPP_HASH_QUADRATIC,
  HASH_DOUBLE: CPP_HASH_DOUBLE,
  HEAP: CPP_HEAP,
  DSU: CPP_DSU,
  DIJKSTRA: CPP_DIJKSTRA,
  MST: CPP_MST,
  TRAVERSAL: CPP_TRAVERSAL,
  TOPO: CPP_TOPO,
  BELLMAN_FORD: CPP_BELLMAN_FORD,
  ASTAR: CPP_ASTAR,
  FLOYD_WARSHALL: CPP_FLOYD_WARSHALL,
  TARJAN_SCC: CPP_TARJAN_SCC,
  AVL: CPP_AVL,
  RB_TREE: CPP_RB_TREE,
  JOHNSON: CPP_JOHNSON,
};
