
# **v4.0**

This document outlines the changes from the original DefinitiveSpec Agent Context (`v3.1`/`v3.2`) to the new **DSAC v4.0 - Final Definitive Edition**. The new version represents a fundamental architectural evolution, transforming the agent from a powerful "implementer" into a true "strategic partner."

### **Summary of Major Changes**

The entire agent context has been refactored from a third-person specification document into a first-person **System Prompt** that defines the agent's identity and a **hardcoded 5-phase operational lifecycle**. The previous flat list of `methodology_rule`s has been superseded by this more robust, structured, and intelligent process. This new architecture enhances usability, security, and extensibility while incorporating a dozen new advanced capabilities.

---

### **Added**

*   **The 5-Phase Operational Lifecycle:**
    *   The core of the new agent is a mandatory, sequential lifecycle: 1. Context & Validation, 2. Pre-Generation Analysis, 3. Core Task Execution, 4. Post-Generation Verification, 5. System Refinement. This provides a clear, predictable, and robust operational flow, replacing the ambiguous `trigger_point` system.

*   **New Strategic Commands:** The agent's capabilities have been expanded beyond simple implementation with a suite of new commands, integrated directly into the lifecycle:
    *   `Generate from Requirement...`: A powerful, multi-step workflow that includes interactive elicitation and intelligent scaffolding.
    *   `Explore Idea...`: A product discovery tool to help Operators flesh out ideas into testable hypotheses.
    *   `Generate Diagram...`: A utility to create Mermaid diagrams from specs for visual analysis.
    *   `Analyze Spec Quality...`: A "linter" for DSpec files to improve the maintainability of the specifications themselves.

*   **New Advanced Analytical Modules:** The agent's analytical capabilities have been significantly upgraded:
    *   **`DataFlowSecurityAnalyzer`:** Proactively traces the flow of sensitive data (`pii_category`) and issues critical warnings on potential security leaks at the specification stage.
    *   **`CrossRequirementPatternAnalyzer`:** A meta-learning module that analyzes the history of generative tasks to suggest new, reusable architectural patterns, helping the DDM ecosystem evolve.

### **Changed**

*   **Format: From Document to System Prompt:** The entire context was reframed as a direct set of instructions to the agent ("You are..."). This provides a stronger persona, improves focus, and aligns better with how LLMs process instructions, leading to more reliable behavior.

*   **`methodology_rule`s -> Integrated Lifecycle Modules:**
    *   The rigid, flat list of `DDM-RULE-XXX` has been completely refactored.
    *   Their logic and intent have been preserved and integrated as named modules within the appropriate phases of the new 5-phase lifecycle (e.g., `NPlusOneDetector` runs in Phase 2, `TestGapAnalyzer` runs in Phase 4). This provides a clearer, more logical process flow.

*   **EBNF Grammar & Schema Definition:**
    *   The core EBNF grammar (Part 4) has been simplified to be more generic and robust. It no longer contains hardcoded constraints for model fields.
    *   The validation rules for model fields are now correctly defined using a `block_schema model.field` in the agent's Knowledge Base (Part 2), making the system more extensible.

### **Security & Stability Enhancements**

*   **Strict User-Facing Grammar:** The EBNF in Part 4 is now a secure, unprivileged grammar for user-provided files. It explicitly **forbids** users from defining system-level constructs like `schema`, `block_schema`, or `plugin`, creating a safe sandbox.

*   **Privileged Profile Parsing:** The agent's core lifecycle (Part 1) now explicitly describes the process of identifying and parsing `Architectural Profile` files in a "privileged mode," allowing them to safely extend the agent's knowledge without compromising the security of the user-facing parser.

*   **Removal of All Internal Contradictions:** All previous self-contradictions have been resolved. The document is now logically sound, with no dangling references or conflicting rules. The version number (`v4.0`) accurately reflects the advanced capabilities described within.