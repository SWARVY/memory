import type { AboutResponse } from 'convex/schema';

export interface AboutEditorProps {
  defaultValue?: AboutResponse;
  onSave: () => void;
}

export interface EmptyAboutProps {
  handleButtonClick: () => void;
}
