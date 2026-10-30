# Directive: [Task Name]

## 1. Goal
Brief description of what this workflow achieves and why.

## 2. Inputs
- Specify all required input parameters, file paths, formats, or external identifiers.

## 3. Execution Tools & Scripts
- Python script(s) in `execution/` to invoke for this task (e.g., `execution/example_tool.py`).
- Required CLI arguments or environment variables.

## 4. Expected Outputs & Deliverables
- **Intermediates**: Temporary files stored in `.tmp/` during processing.
- **Deliverables**: Final target outputs (e.g., Google Sheets, Google Slides, cloud documents, or final reports).

## 5. Edge Cases & Learnings (Self-Annealing)
- Document API limits, rate limits, timeouts, or quirks discovered during execution.
- Record any lessons learned and recovery steps to improve future runs.
