import {
  GOOGLE_TAB_BAR_ITEM_CSS_CLASSNAME,
  GOOGLE_TAB_BAR_ITEM_TEXT_CSS_CLASSNAME,
  STAMPLE_TAB_TITLE_ID,
} from '@src/constants/content';
import {
  findStampleTabBarItem,
  selectStampleTab,
  unselectStampleTab,
} from '@src/helpers/content.helpers';
import { findTabBarItems } from '@src/helpers/content.helpers';
import { useEffect, useState } from 'react';
const CloseIcon: React.FC = () => (
  <svg
    className="mUKzod"
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 24 24"
  >
    <path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z"></path>
  </svg>
);
export const StampleTabTitle: React.FC = () => {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const tabBarItems = findTabBarItems(document);
    const addEventListeners = () => {
      for (const item of tabBarItems) {
        if (item.id !== STAMPLE_TAB_TITLE_ID) {
          item.addEventListener('click', onClickOtherTab);
        }
      }
    };
    addEventListeners();
    return addEventListeners;
  }, []);

  useEffect(() => {
    const stampleTabTitle = findStampleTabBarItem(document);
    const addEventListener = () => {
      stampleTabTitle.addEventListener('click', onClickSelectTab);
    };
    addEventListener();
    return addEventListener;
  }, []);
  const onClickSelectTab = () => {
    setActive(true);
    selectStampleTab(document);
    const stampleTabTitle = findStampleTabBarItem(document);
    stampleTabTitle.removeEventListener('click', onClickSelectTab);
    stampleTabTitle.addEventListener('click', onClickUnselectTab);
  };
  const onClickUnselectTab = () => {
    setActive(false);
    unselectStampleTab(document);
    const stampleTabTitle = findStampleTabBarItem(document);
    stampleTabTitle.removeEventListener('click', onClickUnselectTab);
    stampleTabTitle.addEventListener('click', onClickSelectTab);
  };

  const onClickOtherTab = () => {
    if (active) {
      onClickUnselectTab();
    }
  };
  return (
    <>
      {active ? <CloseIcon /> : null}
      <div className={GOOGLE_TAB_BAR_ITEM_TEXT_CSS_CLASSNAME}>Stample</div>
    </>
  );
};
