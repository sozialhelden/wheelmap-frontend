import styled from 'styled-components';
import Markdown from './Markdown';
import colors from '../../lib/colors';

const StyledMarkdown = styled(Markdown)`
  max-width: 100%;

  h1,
  h2,
  h3,
  h4,
  h5 {
    margin: 1em 0;
  }

  code,
  pre {
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
      monospace;
    color: ${colors.secondaryColor};
  }

  pre {
    padding: 0.5em 0.55em;
    margin: 0.5em 0;
    line-height: 1.3em;
    background: white;
    white-space: pre-wrap;
    max-width: 100%;
    overflow-x: auto;
  }

  p {
    margin-bottom: 16px;
  }

  ul,
  ol {
    margin: 1em 1.25em;
  }
`;

export default StyledMarkdown;
