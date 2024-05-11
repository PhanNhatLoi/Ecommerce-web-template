import { CloseCircleOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/es';
import { find } from 'lodash';
import React, { useState } from 'react';
import { Tab as BTab, Tabs as BTabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_TEXT } from '~/configs';
import AButton from '~/views/presentation/ui/buttons/AButton';

type GiftCardLanguageProps = {
  form: FormInstance<any>;
  loading?: boolean;
  translationFake?: any;
  dataMultiLang: any;
  setDataMultiLang: any;
  currLangCode: string;
  setCurrLangCode: React.Dispatch<React.SetStateAction<string>>;
  setLoadingChangeLang: React.Dispatch<React.SetStateAction<boolean>>;
  setDescription: any;
};

const GiftCardLanguage: React.FC<GiftCardLanguageProps> = (props) => {
  const { t }: any = useTranslation();
  const KeyForNewLanguage = 'NEW';
  const [dataTemplate, setDataTemplate] = useState({
    langCode: undefined,
    image: '',
    name: LANGUAGE_TEXT.EN,
    description: LANGUAGE_TEXT.EN,
    moreInfo: LANGUAGE_TEXT.EN
  });
  const [languages, setLanguages] = useState([
    {
      code: 'vi',
      name: 'Vietnamese',
      native: 'Tiếng Việt'
    },
    {
      code: 'en',
      name: 'English',
      native: 'English'
    }
  ]);

  // --------------------------------
  // FOR MULTIPLE LANGUAGE TAB
  // --------------------------------
  const handleChangeLanguageTab = (value: any) => {
    if (value === KeyForNewLanguage) return;
    // load data for form
    const currProblemLang: any = find(props.dataMultiLang, (l) => {
      return l.langCode === value;
    });
    const defaultTranslate = find(props.translationFake, (l) => {
      return l.langCode === value;
    });

    props.form.setFieldsValue({
      name: currProblemLang?.name?.length > 0 ? currProblemLang?.name : defaultTranslate.name,
      description: currProblemLang?.description?.length > 0 ? currProblemLang?.description : defaultTranslate.description,
      moreInfo: ''
    });
    props.setDescription(currProblemLang?.description?.length > 0 ? currProblemLang?.description : defaultTranslate.description);

    // animation
    props.setLoadingChangeLang(true);
    setTimeout(() => {
      props.setLoadingChangeLang(false);
    }, 100);

    props.setCurrLangCode(value);
  };
  // --------------------------------
  // FOR MULTIPLE LANGUAGE TAB
  // --------------------------------

  return (
    <div className="pb-4">
      <BTabs className="mb-5" activeKey={props.currLangCode} onSelect={handleChangeLanguageTab} id="uncontrolled-tab-translations">
        {props.dataMultiLang.map((lang: any) => {
          return (
            <BTab
              eventKey={lang.langCode}
              title={
                <div>
                  <span>
                    {
                      find(languages, (o) => {
                        return o.code === lang.langCode;
                      })?.name
                    }
                  </span>
                  {lang.closable && (
                    <span>
                      <AButton
                        className="p-0"
                        type="link"
                        icon={<CloseCircleOutlined />}
                        onClick={() => {
                          const newMultiLang = props.dataMultiLang.filter((language: any) => language.langCode !== lang.langCode);
                          props.setDataMultiLang(newMultiLang);
                        }}></AButton>
                    </span>
                  )}
                </div>
              }></BTab>
          );
        })}
      </BTabs>
    </div>
  );
};

export default GiftCardLanguage;
