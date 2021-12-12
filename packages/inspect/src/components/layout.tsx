import styled from "styled-components";

export const InspectContainer = styled.div`
  pointer-events: auto;
  background: var(--shim);
  color: var(--colorText);
  cursor: default;
  position: relative;
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
  min-height: 100%;
`;

export const SplitColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
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



export const TreeRow = styled.div`
  display: flex;
  height: 20px;
	padding-left: ${props => props.indent ? `${props.indent * 20}px` : 0};
`;

export const TreeIndent = styled.div`
	margin-left: ${props => props.indent ? `${props.indent * 20}px` : 0};
`;

export const TreeLine = styled.div`
	margin-left: -1px;
  border-left: 2px dotted var(--borderThin);
`;
