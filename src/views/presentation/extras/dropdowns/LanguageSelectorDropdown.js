/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react';
import clsx from 'clsx';
import { Dropdown } from 'react-bootstrap';
import { DropdownTopbarItemToggler } from '../../dropdowns';
import { setLanguage } from '~/state/ducks/appData/actions';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const DropdownMenuStyled = styled(Dropdown.Menu)`
  min-width: 11rem;
`;

const languages = [
  {
    lang: 'en',
    name: 'English',
    flag: toAbsoluteUrl('/media/svg/flags/226-united-states.svg')
  },
  {
    lang: 'vi',
    name: 'Tiếng Việt',
    flag: toAbsoluteUrl('/media/svg/flags/220-vietnam.svg')
  }
];

export function LanguageSelectorDropdown() {
  const { t, i18n } = useTranslation();
  const lang = useSelector((state) => state['appData'].locale);
  const dispatch = useDispatch();

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  const currentLanguage = languages.find((x) => x.lang === lang);
  return (
    <Dropdown drop="down" alignRight>
      <Dropdown.Toggle as={DropdownTopbarItemToggler} id="dropdown-toggle-my-cart">
        <div className="btn btn-icon btn-clean btn-dropdown btn-lg mr-1">
          <img className="h-25px w-25px rounded" src={currentLanguage?.flag} alt={currentLanguage?.name} />
        </div>
      </Dropdown.Toggle>
      <DropdownMenuStyled className="p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround">
        <ul className="navi navi-hover py-4">
          {languages.map((language) => (
            <li
              key={language.lang}
              className={clsx('navi-item', {
                active: language.lang === currentLanguage?.lang
              })}>
              <a onClick={() => dispatch(setLanguage(language.lang))} href="#" className="navi-link">
                <span className="symbol symbol-20 mr-3">
                  <img src={language.flag} alt={language.name} />
                </span>
                <span className="navi-text">{language.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </DropdownMenuStyled>
    </Dropdown>
  );
}
