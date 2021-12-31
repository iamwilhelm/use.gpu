import styled from "styled-components";

type TreeIndentProps = { indent?: number }

export const InspectContainer = styled.div`
  pointer-events: auto;
  background: var(--shim);
  color: var(--colorText);
  cursor: default;
  position: relative;
  height: 100%;
`;

export const InspectContainerCollapsed = styled(InspectContainer)`
  width: 400px;
  position: relative;
`;

export const InspectToggle = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  pointer-events: auto;
`;

export const Spacer = styled.div`
	width: 20px;
	height: 20px;
`;

export const SplitRow = styled.div`
  display: flex;
  height: 100%;
`;

export const SplitColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const RowPanel = styled.div`
  position: relative;
  &:not(:last-child) {
    border-right: 1px solid var(--borderThin);
  }
`;

export const ColumnPanel = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid var(--borderThin);
  }
`;

export const Scrollable = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

export const Inset = styled.div`
  padding: 20px;
`;

export const Label = styled.div`
  font-weight: bold;
  padding-right: 10px;
  flex-shrink: 0;
  display: flex;
`;

export const TreeRow = styled.div<TreeIndentProps>`
  display: flex;
  height: 20px;
	padding-left: ${props => props.indent ? `${props.indent * 20}px` : 0};
`;

export const TreeIndent = styled.div<TreeIndentProps>`
	margin-left: ${props => props.indent ? `${props.indent * 20}px` : 0};
`;

export const TreeLine = styled.div`
	margin-left: -1px;
  border-left: 2px dotted var(--borderThin);
`;
