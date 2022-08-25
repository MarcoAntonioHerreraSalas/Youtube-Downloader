function Child({handleClick}) {
    return (
      <div>
        <button onClick={event => handleClick(100)}>Click</button>
      </div>
    );
  }


export default Child;