import { useContext } from "react";
import styled from "styled-components"
import { ContactContext } from '../../state/Contact/context/ContactContext';
import { normalize } from '../../utils/normalize';

const LinkListStyles = styled.ul`
  position: relative;
  display: grid;
  grid-template-rows: 0;
  grid-template-columns: auto auto auto auto;
  gap: 20px;
  top: -10vh;
`;

const LinkItemStyles = styled.li`
  list-style: none;

  a {
    display: block;
    color: white;
    text-decoration: none;
    outline: none;

    &:after {
      content: '';
      display: block;
      width: 100%;
      height: 1px;
      background-color: currentColor;

      transition: transform .3s;
      transform: translateY(150%);
    }

    &:hover {
      color: currentColor;
      &:after {
        transform: translateY(0);
      }
    }

    &:focus {
      color: currentColor;
      transform: scale(1.2);
    }
  }
`;

export const Contacts = () => {
  const { state: contactColors } = useContext(ContactContext);
  const r = 255;
  const g = normalize(contactColors.g, 0, 1, 0, 255);
  const b = normalize(contactColors.b, 0, 1, 0, 255);

  return (
    <LinkListStyles style={{ color: `rgb(${r}, ${g}, ${b})` }}>
      <LinkItemStyles>
        <a target="_blank" rel="noreferrer" href="https://github.com/dnlml">Github</a>
      </LinkItemStyles>
      <LinkItemStyles>
        <a target="_blank" rel="noreferrer" href="&#109;&#97;&#105;&#108;&#116;&#111;&#58;&#100;&#97;&#110;&#105;&#101;&#108;&#101;&#109;&#101;&#108;&#105;&#56;&#54;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;">Mail</a>
      </LinkItemStyles>
      <LinkItemStyles>
        <a target="_blank" rel="noreferrer" href="https://twitter.com/danielemeli">Twitter</a>
      </LinkItemStyles>
      <LinkItemStyles>
        <a target="_blank" rel="noreferrer" href="https://www.instagram.com/danielemeli/">Instagram</a>
      </LinkItemStyles>
    </LinkListStyles>
  )
}