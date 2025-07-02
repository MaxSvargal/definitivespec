# **Definitive Development: The Agent-Driven Methodology**

Welcome to the DefinitiveSpec methodology hub. This repository contains the core documents defining our structured, AI-augmented approach to software development, known as the Definitive Development Methodology (DDM).

The central idea is to transform complex software requirements into verified, high-quality code by creating precise, interconnected specifications (`.dspec` files) that act as a single source of truth. These specifications are used to direct a powerful AI agent (`DSAC v3.2`) that assists in code generation, simulation, and analysis.

This document provides an index and guide to the essential documents.

---

## **Core Documents**

This methodology is defined by three key documents, each serving a distinct purpose and audience.

### 1. 📄 `methodology_guide.md` - The User Manual & Onboarding Guide

*   **Purpose:** This is the primary guide for understanding and using DDM on the PrimeCart project. It explains the "why" behind the methodology, details the core specification artifacts (`requirement`, `model`, `code`, etc.), and walks through the development lifecycle.
*   **Audience:** **Everyone.** This is the **"START HERE"** document for all new team members, regardless of role.
*   **When to Read:** Read this first to get a comprehensive understanding of the DDM process, how to write effective specs, and how to collaborate with the AI agent. Use it as a reference thereafter.
*   **Key Contents:**
    *   **Chapter 1-2:** The core principles of DDM and the tooling ecosystem.
    *   **Chapter 3:** A detailed breakdown of all DSpec artifact types with examples.
    *   **Chapter 4:** The iterative DDM Lifecycle and a practical workflow example.
    *   **Appendices:** Includes the normative grammar (EBNF), a glossary, common pitfalls, and best practices for interacting with the AI agent.

### 2. ⚙️ `dspec_agent_context.dspec.md` - The Agent's "Source Code"

*   **Purpose:** This is the complete, normative, and machine-readable contract for the `v3.1 Autonomous AI Agent`. It is not prose; it is a specification that defines the agent's capabilities, rules, and implementation patterns.
*   **Audience:**
    *   **Primary:** The AI Agent itself. This file is the primary input for every task.
    *   **Secondary:** Architects and Tech Leads responsible for governing the project's technical patterns.
    *   **Tertiary:** Developers who need to look up the exact template for a specific `directive` pattern.
*   **When to Read:** Read this when you need the absolute ground truth. For example, if you want to know the precise code template for the `PERSIST` keyword or see the exact rules the agent is bound by. Architects will read this when considering changes to project-wide patterns.
*   **Key Contents:**
    *   **Part 1: Normative EBNF Grammar:** The required syntax for all `.dspec` files.
    *   **Part 2: Artifact Reference Schema:** The "type system" defining the structure of all artifacts.
    *   **Part 3: Core Implementation & Generative Directives:** The agent's "Cookbook" of implementation patterns (`PERSIST`, `CALL`, NFR patterns, etc.).
    *   **Part 4: Methodology Micro-Guide:** The mandatory `DDM-RULE-XXX` protocol that the agent MUST follow.

### 3. 🗺️ `agent_guide.md` - Tactical Field Manual & SOPs

*   **Purpose:** A collection of role-specific, tactical documents outlining Standard Operating Procedures (SOPs) for specific, advanced tasks. It's the "how-to" for executing key DDM processes.
*   **Audience:** Role-specific (Developers, Architects, Team Leadership).
*   **When to Read:** Read the relevant section before performing one of the specific tasks described. It's a field manual, not a book to be read cover-to-cover.
*   **Key Contents:**
    *   **Operator's Field Manual:** Step-by-step instructions for developers on using core commands like `Implement Code Spec` and `Run Simulation`.
    *   **Directive Governance Process:** An SOP for architects and tech leads on how to propose, review, and approve changes to the agent's directives (in `dspec_agent_context.md`).
    *   **Agent Compliance Test Suite:** A set of `test` specs for the AI/Tooling team to verify that the agent correctly adheres to its protocol.
    *   **Phased Rollout Plan:** A strategic document for team leadership on how to adopt the methodology.

---

## **The Methodology in a Nutshell**

This DDM version is built on the following principles:

*   **Specifications as the Single Source of Truth:** The `.dspec` files define everything.
*   **Precision and Unambiguity:** Specs are written to be machine-readable, removing human guesswork.
*   **Structure and Interconnectivity:** All artifacts are linked, creating a traversable knowledge graph of the system.
*   **AI as a Collaborative Partner & Automated Agent:** The agent assists in drafting specs and is **strictly guided by `directive`s** to generate code.
*   **Automated Validation First:** Specs are validated before code is ever written.
*   **Iterative Refinement & Bi-Directional Feedback:** The process is a cycle. Discoveries in code must lead to updates in the specs first.

### The DDM Lifecycle
```
+-----------------------------------------------------------------------+
|    (Ideas, Business Needs)                                            |
|            |                                                          |
|            v                                                          | Feedback
|      [ STAGE 1: Inception ] ---> (req, kpi)                           |   ^
|            |                                                          |   |
|            v                                                          |   |
|      [ STAGE 2: Detailed Spec ] -> (design, api, model, code, test,   |   |
|            |                          interaction, policy, directive) |   |
|            v                                                          |   |
|      [ STAGE 3: Spec Validation ] <-------(Refinements)---------------+---+-> SVS / Agent Preflight (DDM-RULE-000)
|            |                                         ^                |
|            v (Validated Specs)                       | Feedback       |
|      [ STAGE 4: Auto-Gen & Verify (AI Agent) ] ------|----------------+--->[Code/Tests]
|            |                                         |                |
|            v (Failures, Code Discoveries)            |                |
|      [ STAGE 5: Analysis & Debug ] ------------------+ (Update Spec!) | Rule DDM-RULE-002
+-----------------------------------------------------------------------+
```

---

## **Recommended Reading Path**

To get started with the DDM and the DSAC v3.2 agent, follow this path based on your role:

#### **For All Roles (Developers, QAs, PMs, Architects):**
1.  **Start Here:** Read the `methodology_guide.md` (Chapters 1-4) to understand the core philosophy, the artifacts, and the workflow.
2.  **Skim:** Review the appendices in the `methodology_guide.md`, paying special attention to "Common Pitfalls" (Appendix E).

#### **For Developers:**
1.  **After the Guide:** Read the **"Operator's Field Manual"** in `agent_guide.md`. This is your tactical guide for day-to-day tasks.
2.  **Reference as Needed:** When writing `detailed_behavior`, refer to **Part 3 (Directives)** of `dspec_agent_context.dspec.md` to see the available `pattern` keywords (`CALL`, `PERSIST`, etc.) and how they work.

#### **For Architects & Tech Leads:**
1.  **Read Everything:** You are the custodians of the methodology and its implementation.
2.  **Master:** The `dspec_agent_context.dspec.md` is your primary domain. You own the patterns in Part 3.
3.  **Implement:** The **"Directive Governance Process"** in `agent_guide.md` is your SOP for managing architectural patterns.

#### **For Product Owners & QA Engineers:**
1.  **Primary Document:** The `methodology_guide.md` is your main resource. Focus on how to write clear `requirement`, `kpi`, and `test` specifications.
2.  **Reference for Tasks:** Refer to the **"Operator's Field Manual"** in `agent_guide.md` if you are involved in running `What-If Analysis` or `Simulations`.
