# TODO

## Now

1. After connecting, update the target port color to match the edge color.
2. Add exclusive wire selection and remove selected wires on `Delete`.

## Architecture

1. Build the `graph-document` component in the new format:
   - `state`
   - `query`
   - `factory`
   - `use-cases`
2. After that, build top-level tab import/export as a bundle between `workspace` and `graph-document`.
3. Then move `graph-runtime` to the new component layer instead of legacy snapshot/document ownership.

## Future

1. Copy / paste a scheme into another project.
2. Undo / redo history.
3. Add resizable block containers that can group nodes, be copied, and be removed as a group.

## Bugs

1. With virtualization enabled, if selected elements are moved off-screen too quickly, some of them disappear and do not come back. Elements and links need a correct redraw path.
2. During tab switch, leftover `tool vertices` stay forever instead of being cleaned up. We need centralized tool cleanup before switching graph/runtime context.
