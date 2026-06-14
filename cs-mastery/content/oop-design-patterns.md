# OOP & Architectural Design Patterns

## Overview
Object-Oriented Programming and Design Patterns are the vocabulary of software architecture. In elite Machine Coding rounds (Atlassian, Uber, Flipkart) or LLD (Low-Level Design) interviews, you have 45 minutes to write fully extensible, modular, production-ready code.

## Pattern 4.1: SOLID Principles Applied
### Pattern Description
The five pillars of maintainable code: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.

### Core Invariant
**Open for Extension, Closed for Modification:** The holy grail of LLD. If a new requirement comes in (e.g., "Add a new Payment Method"), you should only have to *add* a new class, not *modify* existing core classes containing dozens of `if/else` statements.

### Curated Questions
---
##### Q1: The "Fat Interface" Problem (Interface Segregation)
| Field | Value |
|-------|-------|
| **Difficulty** | Medium |
| **Companies** | Amazon, Microsoft |

**Key Observation**: If you have an `IWorker` interface with `work()` and `eat()`, and you create a `RobotWorker` class, it is forced to implement `eat()` (perhaps throwing an exception). This violates ISP. Split it into `IWorkable` and `IFeedable`.
---
##### Q2: Dependency Injection (Dependency Inversion)
| Field | Value |
|-------|-------|
| **Difficulty** | Medium |
| **Companies** | Google, Uber |

**Key Observation**: High-level modules should not depend on low-level modules; both should depend on abstractions. Instead of a `UserService` instantiating a `MySQLDatabase` inside its constructor, pass an `IDatabase` interface into the constructor. This makes testing (mocking) and swapping databases trivial.

## Pattern 4.2: Behavioral Patterns (Strategy & Observer)
### Pattern Description
Patterns that handle communication and algorithms between objects.

### Core Invariant
**Composition over Inheritance:** Inheritance creates rigid, deeply nested hierarchies that break when requirements change. Composition allows you to plug-and-play behaviors at runtime using interfaces.

### Curated Questions
---
##### Q1: The Strategy Pattern (Replacing switch statements)
| Field | Value |
|-------|-------|
| **Difficulty** | Hard |
| **Companies** | Atlassian, Uber |

**Key Observation**: If your `CheckoutContext` has a massive switch statement for `calculateDiscount(type)`, it violates the Open/Closed principle. Instead, create a `DiscountStrategy` interface, implement `BlackFridayStrategy` and `EmployeeStrategy`, and inject the specific strategy into the context at runtime.
---
##### Q2: The Observer Pattern (Event-Driven Systems)
| Field | Value |
|-------|-------|
| **Difficulty** | Medium |
| **Companies** | Meta, LinkedIn |

**Key Observation**: Used heavily in UI systems and pub/sub messaging. A `Subject` maintains a list of `Observers`. When state changes, it iterates and calls `update()` on all of them. This decouples the sender of the event from the receivers.

## Pattern 4.3: Creational Patterns (Factory & Singleton)
### Pattern Description
Patterns that deal with object creation mechanisms, optimizing for reuse and decoupling.

### Core Invariant
**The Singleton Anti-Pattern:** While famous, Singletons introduce global state, making unit testing incredibly difficult (tests leak state into each other). Modern frameworks prefer Dependency Injection containers to manage single instances rather than strict Singleton classes.

### Curated Questions
---
##### Q1: Factory Method vs. Abstract Factory
| Field | Value |
|-------|-------|
| **Difficulty** | Medium |
| **Companies** | Amazon |

**Key Observation**: A Factory Method provides an interface for creating *one* type of object but lets subclasses alter the type. An Abstract Factory is a factory of factories—it groups the creation of a *family* of related objects (e.g., MacButton, MacCheckbox vs WinButton, WinCheckbox) without specifying their concrete classes.
