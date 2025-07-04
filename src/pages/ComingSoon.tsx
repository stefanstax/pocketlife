import { Link } from "react-router";
import { PRIMARY, SHARED } from "../app/globalClasses";

const ComingSoon = () => {
  return (
    <div className="flex flex-col justify-center text-center gap-4">
      <h1 className="text-2xl font-black">Coming Soon</h1>
      <p>
        I have this feature in our backlog, which means soon enough I'll start
        working on it.
      </p>
      <p>If you'd like to learn what is it about, email me below.</p>
      <Link to="mailto:website@maypact.com" className={`${PRIMARY} ${SHARED}`}>
        Email me
      </Link>
    </div>
  );
};

export default ComingSoon;
