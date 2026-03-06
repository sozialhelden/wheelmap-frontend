import styled from "styled-components";

const HeaderImageSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(100% + var(--space-3) * 2); 
    height: 15rem; 
    margin-left: calc(-1 * var(--space-3)); 
    margin-right: calc(-1 * var(--space-3)); 
    margin-bottom: var(--space-5);
    background: var(--gray-4);
    overflow: hidden;
    img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; };
  `;

export default HeaderImageSection;
