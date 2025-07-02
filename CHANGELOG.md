# **v4.0 - The Definitive Edition**

This document outlines the changes from the DefinitiveSpec Agent Context `v3.x` series to the new **DSAC v4.0**. This version represents a fundamental architectural evolution, transforming the agent from a powerful "implementer" into a true "strategic partner."

### **Summary of Major Changes**

The entire agent context has been refactored from a third-person specification document into a first-person **System Prompt** that defines the agent's identity and a hardcoded, stateful operational lifecycle. The previous flat list of `methodology_rule`s has been superseded by this more robust, structured, and intelligent process.

The agent's operational model has been upgraded from a stateless, transactional protocol to a stateful **Project Awareness** model, enabling deep, project-wide analysis and strategic guidance. This new architecture enhances usability, security, and extensibility while incorporating a dozen new advanced capabilities, including powerful analytical modules, expanded strategic commands, and a more expressive specification language.

---

### **Added**

#### **Core Architecture & Lifecycle**
*   **Stateful Project Awareness:** The agent now bootstraps by loading and indexing the entire project context (`Phase 0: Project Synchronization`), enabling deep, cross-file understanding and impact analysis.
*   **The 5-Phase Operational Lifecycle:** The core of the agent is a mandatory, sequential lifecycle: `0. Project Sync`, `1. Context & Validation`, `2. Pre-Generation Analysis`, `3. Core Task Execution`, `4. Post-Generation Verification`, `5. System Refinement`.
*   **Strategic Modules:**
    *   **`StrategicAdvisor`:** A new module in Phase 1 that validates the logic of a spec against the business rationale of its parent requirement, preventing "garbage-in, garbage-out."
    *   **`DataFlowSecurityAnalyzer`:** Proactively traces the flow of sensitive data (`pii_category`) and issues critical warnings on potential security leaks at the specification stage.
    *   **`CrossRequirementPatternAnalyzer`:** A meta-learning module that analyzes task history to suggest new, reusable architectural patterns, helping the system evolve.
*   **Privileged Architectural Profiles:** Formally defined the concept of an `Architectural Profile` as a privileged document used to safely extend the agent's core capabilities, schemas, and patterns.

#### **New Commands & Capabilities**
*   **Strategic Commands:**
    *   `Generate from Requirement...`: A multi-step workflow with interactive elicitation and intelligent scaffolding.
    *   `Explore Idea...`: A product discovery tool to help flesh out ideas into testable hypotheses.
    *   `Analyze Impact of Change...`: Leverages the full Project Index to report on the ripple effects of a proposed change.
    *   `Analyze Spec Quality...`: A "linter" for spec files to improve maintainability.
    *   `Analyze Production Report...`: Compares operator-provided production data against `kpi` and `nfr` specs to bridge the gap between specification and reality.
*   **Meta-Learning & Refactoring Commands:**
    *   `Distill Pattern from...`: An operational command to guide the agent in abstracting existing logic into a new, reusable `architectural_pattern`.
*   **Utility Commands:**
    *   `Generate Diagram...`: Creates Mermaid diagrams from specifications for visual analysis.

#### **Specification Language Enhancements**
*   **Enhanced Testing & Mocking (`stub` artifact):** Introduced a first-class `stub` artifact to define stable, version-controlled data payloads for mocking dependencies and setting up canonical test states.
*   **Expanded Concurrency Model:** The `detailed_behavior` language now supports modern concurrency primitives (`PARALLEL`, `RACE`, etc.), enabling expressive modeling of complex asynchronous operations (e.g., `LET [resA, resB] = PARALLEL { ... }`).
*   **Hyper-Granular Test Traceability:** The `test` schema now supports optional `verifies_step` and `verifies_transition` fields, linking tests directly to specific implementation details.
*   **Strategic Rationale in Patterns:** `architectural_pattern` definitions now support a `rationale` field to explain the trade-offs and "why" behind a pattern.
*   **Refactoring Safety Attribute:** `refactor_pattern` definitions now support an `impact_analysis_scope` (`single_file` or `full_project`) to trigger mandatory safety protocols.

---

### **Changed**

*   **From Document to System Prompt:** The entire context was reframed as a direct set of first-person instructions ("You are..."), strengthening the agent's persona and improving the reliability of its behavior.
*   **From Enforcer to Partner:** All rigid `HALT` instructions were replaced with an interactive `[PAUSE] RECOMMENDATION` protocol, empowering the Operator with the final decision while still enforcing methodological rigor.
*   **`methodology_rule`s -> Integrated Modules:** The flat list of `DDM-RULE-XXX` rules has been completely refactored. Their logic is now integrated into named modules within the appropriate phases of the new lifecycle (e.g., `NPlusOneDetector` in Phase 2).
*   **Test-Driven Protocol:** The `Implement Code Spec` command now follows a clarified, mandatory 3-step process that enforces generating tests *before* implementation code.
*   **Learning Loop:** The passive "learning loop" in Phase 5 is now an explicit process driven by the `Distill Pattern from...` command.
*   **Enhanced Refactoring Safety:** The `Refactor...` command now performs a mandatory `Analyze Impact of Change...` for any refactoring with a `full_project` scope, requiring Operator confirmation before proceeding.
*   **Schema & Grammar Definition:** The core EBNF grammar has been simplified. Complex validation rules were moved from the grammar into `block_schema` definitions in the agent's Knowledge Base, making the system more modular and extensible.
*   **Test Schema:** The `test` artifact schema was updated to support the new `stub` artifact, with `data_inputs` linking to stubs and a `mock_responses` attribute for declarative mocking.

---

### **Security & Stability**

*   **Strict User-Facing Grammar:** The EBNF for user-provided files is now a secure, unprivileged grammar that explicitly **forbids** system-level constructs like `schema` or `plugin`, creating a safe sandbox.
*   **Privileged Profile Parsing:** The agent's lifecycle now includes a "privileged mode" for parsing `Architectural Profile` files, allowing them to safely extend the agent's knowledge without compromising the user-facing parser.
*   **Refactoring Guardrails:** The mandatory impact analysis for wide-scope refactoring adds a critical layer of stability, preventing unintended consequences from large-scale changes.
*   **Logical Soundness:** All internal contradictions from previous versions have been resolved. The document is now logically sound, with no dangling references or conflicting rules.