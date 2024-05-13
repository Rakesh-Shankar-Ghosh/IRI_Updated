import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const SingleUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/users/get-user/${id}`
        );
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div>
      {user && (
        <>
          <h2>User Details</h2>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Country: {user.country}</p>
          <p>Profession: {user.profession}</p>
        </>
      )}
    </div>
  );
};

export default SingleUser;
