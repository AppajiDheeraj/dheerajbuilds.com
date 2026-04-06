import "./Transition.css";

const Transition = (pageComponent) => {
  return (props) => pageComponent(props);
};

export default Transition;
