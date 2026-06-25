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

// Export
window.CPP_SOURCES = {
  LL_ARRAY: CPP_LL_ARRAY,
  LL_POINTER: CPP_LL_POINTER,
  STACK_ARRAY: CPP_STACK_ARRAY,
  STACK_POINTER: CPP_STACK_POINTER,
  QUEUE_ARRAY: CPP_QUEUE_ARRAY,
  QUEUE_POINTER: CPP_QUEUE_POINTER,
};
