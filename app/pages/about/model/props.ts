import type { AboutResponse } from 'convex/schema';

export interface AboutEditorProps {
  defaultValue?: AboutResponse;
  editable?: boolean;
  onEdit: () => void;
  onSave: () => void;
}

export interface EmptyAboutProps {
  handleButtonClick: () => void;
}
