import styled from 'styled-components'

const Description = styled.footer.attrs({ className: 'description' as string })`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem !important;
  overflow: hidden;
  text-overflow: ellipsis;

  color: rgba(0, 0, 0, 0.6);

  &.has-quotes {
    padding-left: 8px;
    border-left: 2px solid rgba(0, 0, 0, 0.5);
    quotes: '“' '”';
    &:before {
      color: rgba(0, 0, 0, 0.8);
      content: open-quote;
    }

    &:after {
      color: rgba(0, 0, 0, 0.8);
      content: close-quote;
    }
  }
`

export default Description
