# TODO: Implement Election-Category-Candidate Voting Flow

## Tasks
- [x] Update Vote.tsx to fetch elections and categories alongside candidates
- [x] Update Results.tsx to fetch elections and categories alongside results
- [x] Modify UI in both pages to display dynamic election names instead of hardcoded titles
- [x] Implement multi-step voting flow: Elections -> Categories -> Candidates -> Vote
- [x] Add UI components for election and category selection
- [x] Update voting progress steps to reflect new flow
- [x] Test the complete voting flow
- [x] Implement election-category-candidate selection UI
- [x] Update API types to match actual backend response structure
- [x] Fix candidate filtering logic to use correct field names (category field)
- [x] Update candidate display to show manifesto instead of description
- [x] Debug candidate display issue - candidates not showing when filtered by category (debug logging added)
- [x] Fix vote submission API to include election, category, and candidate IDs

## Notes
- Use Promise.all for concurrent fetching to improve performance
- Handle loading states and errors appropriately
- Elections and categories are fetched but not yet used in filtering; this is for dynamic display
