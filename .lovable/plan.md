

## Fix Build Error

**Problem**: The `Right Calf` entry in `defaultBackPositions` is missing the `rotation` property, causing a TypeScript error.

**File**: `src/components/dashboard/VisualBodySelector.tsx`

**Change**: Add `rotation: 0` to the `Right Calf` object (around line 42):

From:
```js
'Right Calf': { top: 115, left: 60, width: 12, height: 20, shape: 'circle' as const }
```

To:
```js
'Right Calf': { top: 115, left: 60, width: 12, height: 20, rotation: 0, shape: 'circle' as const }
```

This is a one-line fix.

