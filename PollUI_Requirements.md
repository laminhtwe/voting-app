# Poll UI Requirements

This document outlines the requirements for the Poll UI, ensuring a clear understanding of the desired functionality and behavior.

## 1. Hover Effect

*   **Description:** Poll option buttons should exhibit a zoom-in effect when the user hovers the mouse over them.
*   **Implementation:** Apply a CSS `transform: scale(1.05)` to the option button on hover.

## 2. Select Animation

*   **Description:** When the user selects a poll option, a distinct animation should be triggered to visually indicate the selection.
*   **Implementation:**
    *   Add a CSS class (e.g., `.selected`) to the selected option.
    *   This class should define a visual animation, such as a background color change, a scaling effect, or a combination of both.
    *   Example CSS:
        ```css
        .selected {
            background-color: #your-selected-color;
            transform: scale(1.1);
            transition: all 0.2s ease-in-out;
        }
        ```

## 3. Select Animation Overrides Hover

*   **Description:** Once an option is selected, the select animation should take precedence over the hover effect. The hover effect should be disabled for the selected option.
*   **Implementation:**
    *   When an option is selected, remove any hover-related styles or classes from the selected option.
    *   Ensure that the `.selected` class styles are applied with higher specificity than the hover styles.

## 4. Display Vote Counts and Percentages

*   **Description:** After the user votes, the UI should display the number of votes and the percentage of total votes for each option. A visual "power bar" should also be displayed to represent the vote distribution.
*   **Implementation:**
    *   Calculate the vote counts and percentages for each option.
    *   Display the vote count and percentage next to each option.
    *   Implement a "power bar" using CSS to visually represent the percentage of votes for each option.
    *   Example HTML/CSS:
        ```html
        <div class="option">
            Option Label
            <div class="power-bar">
                <div class="power-bar-fill" style="width: 80%;"></div>
            </div>
            <span>80% (80 votes)</span>
        </div>
        ```
        ```css
        .power-bar {
            width: 100%;
            background-color: #eee;
        }

        .power-bar-fill {
            background-color: #your-power-bar-color;
            height: 10px;
        }
        ```

## 5. Maintain Poll Card Structure

*   **Description:** The existing structure and styling of the poll card should be preserved as much as possible.
*   **Implementation:**
    *   Avoid making drastic changes to the existing HTML structure and CSS styles.
    *   Integrate the new features and functionalities seamlessly into the existing design.

By adhering to these requirements, we can ensure a consistent and user-friendly experience for the Poll UI.