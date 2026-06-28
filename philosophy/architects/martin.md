# Robert C. Martin — Uncle Bob, Clean Architecture

## Thesis
Source-code dependencies may point in only one direction: inward, toward higher-level
policy. Nothing in an inner circle may know anything about an outer one — entities and
use cases must not depend on frameworks, the database, or the UI. The arrows decide the
architecture.

## Anchor quotes
> "The Dependency Rule"

## In Architect-First
- Rung 5 (DIRECTION): dependencies point inward only — toward business rules, never outward toward frameworks, DB, or UI. When `/architect-review` flags a `direction:` violation, an inner layer has learned about an outer one; reverse the arrow (depend on an abstraction the inner layer owns).
