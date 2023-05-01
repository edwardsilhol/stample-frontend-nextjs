import {
  STAMPLE_TAB_TITLE_ID,
  GOOGLE_TAB_BAR_ITEM_CSS_CLASSNAME,
  GOOGLE_TAB_BAR_ITEM_ACTIVE_CSS_CLASSNAME,
  GOOGLE_TAB_BAR_ITEM_CSS_ANCHOR_CLASSNAME,
} from '@src/helpers/constants/content';
import {
  injectStampleTabContent,
  selectStampleTab,
  unselectStampleTab,
} from '@src/helpers/content-script.helpers';
import { findTabBarItems } from '@src/helpers/content-script.helpers';
import { useEffect, useState } from 'react';

export const StampleTabTitle: React.FC = () => {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const tabBarItems = findTabBarItems(document);
    for (const item of tabBarItems) {
      if (item.id !== STAMPLE_TAB_TITLE_ID) {
        item.addEventListener('click', () => {
          setActive(false);
          unselectStampleTab(document);
        });
      }
    }

    return () => {
      for (const item of tabBarItems) {
        if (item.id !== STAMPLE_TAB_TITLE_ID) {
          item.removeEventListener('click', () => {
            setActive(false);
            unselectStampleTab(document);
          });
        }
      }
    };
  }, []);
  useEffect(() => {
    if (active) {
      injectStampleTabContent(document);
    }
  }, [active]);
  const onClickSelectTab = () => {
    if (active) {
      return;
    }
    setActive(true);
    selectStampleTab(document);
  };
  return (
    <>
      {active ? (
        <span>Stample</span>
      ) : (
        <a onClick={onClickSelectTab} style={{ cursor: 'pointer' }}>
          Stample
        </a>
      )}
      {active && (
        <div
          style={{
            background: '#1a73e8',
            height: '3px',
            marginTop: '11px',
          }}
        />
      )}
    </>
  );
};
