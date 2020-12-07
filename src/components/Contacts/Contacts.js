import styled from "styled-components"

const LinkListStyles = styled.ul`
  position: relative;
  display: flex;
  gap: 20px;
  top: -10vh;
`;

const LinkItemStyles = styled.li `
  list-style: none;

  a {
    color: white;
    text-decoration: none
  }
`;

export const Contacts = () => {
  return (
    <LinkListStyles>
      <LinkItemStyles>
        <a href="danielemeli.com">Github</a>
       </LinkItemStyles>
      <LinkItemStyles> <a href="danielemeli.com">Mail</a> </LinkItemStyles>
      <LinkItemStyles> <a href="danielemeli.com">Twitter</a> </LinkItemStyles>
      <LinkItemStyles> <a href="danielemeli.com">Instagram</a> </LinkItemStyles>
    </LinkListStyles>
  )
}