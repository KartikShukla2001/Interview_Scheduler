import React, { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    window.location.href = "/dashboard";
  }, []);

  return (
    <>
      <main></main>
    </>
  );
};

export default Home;
