import styled from 'styled-components'

export const StyledTable = styled.table`
  th {
    text-align: left;
    vertical-align: top;
    padding-right: 1rem !important;
  }

  th {
    font-weight: 500;
    min-width: 6rem;
  }

  th,
  td,
  tbody {
    p:first-child {
      margin-top: 0;
    }
    margin: 0;
    padding: 0.25rem 0;
  }

  table {
    margin: 0;
    padding: 0;
    border: 0;
    border-spacing: 0px;
    border-collapse: separate;

    th,
    td {
      padding: 0;
      margin: 0;
      border: none;
    }
  }

  pre {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    max-width: 100%;
  }
`
