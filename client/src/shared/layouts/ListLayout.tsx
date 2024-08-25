import React from "react";
import { MdRefresh } from "react-icons/md";

import { getCurrentDateTime } from "../utils/date";

interface ListLayoutProps {
  children: React.ReactNode;
  title: string;
  refresh: () => void;
}

const ListLayout: React.FC<ListLayoutProps> = ({
  children,
  title,
  refresh,
}) => {
  return (
    <section className="list-layout">
      <div className="list-layout__intro">
        <h1>{title}</h1>
        <div className="list-layout__date">
          <strong>as of : </strong>
          {getCurrentDateTime()}
        </div>
        <div className="list-layout__refresh" onClick={refresh}>
          <MdRefresh /> refresh
        </div>
      </div>
      {children}
    </section>
  );
};

export default ListLayout;
