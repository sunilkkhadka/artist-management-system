import React, { useState } from "react";
import ArtistList from "../../artist/components/ArtistList";
import { useAuth } from "../../auth/hooks/useAuth";
import UserList from "../../user/components/UserList";

type TabListProps = {
  name: string;
  show: boolean;
  component: React.ReactElement;
};

const Home = () => {
  const auth = useAuth();

  const tabList: TabListProps[] = [
    {
      name: "User List",
      show: auth.role === "super_admin" ? true : false,
      component: <UserList />,
    },
    {
      name: "Artist List",
      show:
        auth.role === "artist_manager" || auth.role === "super_admin"
          ? true
          : false,
      component: <ArtistList />,
    },
  ];

  return (
    <main className="home">
      <section className="home__container">
        <Tabs tabList={tabList} />
      </section>
    </main>
  );
};

const Tabs = ({ tabList }: { tabList: TabListProps[] }) => {
  const [activeTab, setActiveTab] = useState<TabListProps>(
    tabList.filter((tab) => tab.show)[0]
  );

  const handleActiveTab = (tab: TabListProps) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="tabs">
        <ul className="tabs__list">
          {tabList.map(
            (tab) =>
              tab.show && (
                <li
                  className={`${
                    activeTab.name === tab.name
                      ? "tabs__item active"
                      : "tabs__item"
                  }`}
                  key={tab.name}
                  onClick={() => handleActiveTab(tab)}
                >
                  {tab.name}
                </li>
              )
          )}
        </ul>
      </div>
      {activeTab?.component ? activeTab.component : ""}
    </>
  );
};

export default Home;
