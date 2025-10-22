import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="custom-loader" />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .custom-loader {
    width: 50px;
    height: 50px;
    display: grid;
  }

  .custom-loader::before,
  .custom-loader::after {
    content: "";
    grid-area: 1/1;
    --c: radial-gradient(farthest-side,#d1f1ff 92%,rgba(179, 53, 53, 0));
    background: var(--c) 50%  0, 
        var(--c) 50%  100%, 
        var(--c) 100% 50%, 
        var(--c) 0    50%;
    background-size: 12px 12px;
    background-repeat: no-repeat;
    animation: s2 1s infinite;
  }

  .custom-loader::before {
    margin: 4px;
    filter: hue-rotate(45deg);
    background-size: 8px 8px;
    animation-timing-function: linear
  }

  @keyframes s2 {

    100% {
      transform: rotate(.5turn)
    }
  }`;

export default Loader;
