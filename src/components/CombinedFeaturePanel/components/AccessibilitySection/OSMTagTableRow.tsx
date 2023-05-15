import StyledMarkdown from "../../../shared/StyledMarkdown";
import { EditButton } from "./EditButton";
import { OSMTagProps } from "./OSMTagProps";


export function OSMTagTableRow(
  {
    key, hasDisplayedKey, keyLabel, valueElement, isEditable, editURL, keyDetails, valueDetails,
  }: OSMTagProps
) {
  const valueIsNumeric = typeof valueElement === 'string' && valueElement.match(/^-?\d+(\.\d+)?$/);
  const displayedKey = hasDisplayedKey && <th rowSpan={keyDetails ? 1 : 2}>{keyLabel}</th>;
  const textAlign = valueIsNumeric ? 'right' : 'left';
  const valueIsString = typeof valueElement === 'string';
  const ValueElement = valueElement && valueElement !== "" && valueIsString ? 'td' : 'td';
  const displayedValue = <ValueElement colSpan={hasDisplayedKey ? 1 : 2} style={{ textAlign, paddingBottom: '0.25rem' }}>
    {valueIsString ? <StyledMarkdown inline={true}>{valueElement}</StyledMarkdown> : valueElement}
  </ValueElement>;

  return (
    <tbody key={key}>
      <tr>
        {displayedKey}
        {displayedValue}
        <td style={{ textAlign: "right" }}>
          {isEditable && <EditButton editURL={editURL} />}
        </td>
      </tr>
      {[keyDetails, valueDetails].filter(Boolean).map((details, i) => (
        <tr key={i}>
          <td colSpan={2}>
            <StyledMarkdown>
              {details}
            </StyledMarkdown>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
