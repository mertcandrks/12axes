import type { Axis, ArchetypeQuestion, QuizPayload, QuizResult } from '../types/quiz';
import { trQuestions } from './trQuestions';
const axes: Record<string, {label:string;leftPole:string;rightPole:string}> = {
  "estrutura": {
    "label": "Yönetim Yapısı",
    "leftPole": "Federal",
    "rightPole": "Üniter"
  },
  "representacao": {
    "label": "Temsil",
    "leftPole": "Demokrasi",
    "rightPole": "Otokrasi"
  },
  "poder": {
    "label": "Devlet Yetkisi",
    "leftPole": "Güvenlik",
    "rightPole": "Özgürlük"
  },
  "imigracao": {
    "label": "Göç",
    "leftPole": "Asimilasyon",
    "rightPole": "Çok Kültürlülük"
  },
  "diplomacia": {
    "label": "Diplomasi",
    "leftPole": "Militarizm",
    "rightPole": "Pasifizm"
  },
  "intervencao": {
    "label": "Dış Müdahale",
    "leftPole": "Müdahalecilik Karşıtlığı",
    "rightPole": "Milliyetçilik"
  },
  "economia": {
    "label": "Ekonomi",
    "leftPole": "Kamu",
    "rightPole": "Özel Sektör"
  },
  "controle": {
    "label": "Ekonomik Denetim",
    "leftPole": "Planlama",
    "rightPole": "Serbest Piyasa"
  },
  "comercio": {
    "label": "Ticaret",
    "leftPole": "Korumacılık",
    "rightPole": "Küreselleşme"
  },
  "religiao": {
    "label": "Din",
    "leftPole": "Laiklik / Dinsizlik",
    "rightPole": "Dindarlık"
  },
  "moral": {
    "label": "Ahlak",
    "leftPole": "İlerlemecilik",
    "rightPole": "Gelenekçilik"
  },
  "tecnologia": {
    "label": "Teknoloji",
    "leftPole": "Teknoloji",
    "rightPole": "Biyoloji"
  }
};
const archetypes: Record<string,{label:string;text:string;options:string[]}> = {
  "sociedade": {
    "label": "Toplum",
    "text": "Toplum neyin üzerine kurulmalıdır?",
    "options": [
      "İnanç, aile ve ulusal gelenekler",
      "Gelenekler ve inanç, yavaş değişim",
      "Herkes dilediği gibi yaşasın",
      "Eşitlik, çeşitlilik ve yurttaşlık hakları",
      "Din olmadan gelenek ve düzen",
      "Toplumsal adalet için inanç"
    ]
  },
  "poder": {
    "label": "İktidar",
    "text": "Siyasi iktidar nasıl düzenlenmelidir?",
    "options": [
      "Merkezî yönetilen tek lider veya parti",
      "Sınırlı oy hakkıyla elitlerin yönetimi",
      "Denge ve denetim mekanizmaları olan demokrasi",
      "Çok küçük bir devlet veya hiç devlet olmaması",
      "Devletsiz düzen, konseyler veya sözleşmeler"
    ]
  },
  "economia": {
    "label": "Ekonomi",
    "text": "Üretimi kim kontrol etmelidir?",
    "options": [
      "Patronsuz, ortaklaşa ve planlı üretim",
      "Kooperatifler, sosyal devlet ve düzenlemeler",
      "Kuralları ve sosyal güvenlik ağı olan piyasa",
      "Devletin birleştirdiği işverenler ve sendikalar",
      "Devletin koruduğu yerli şirketler",
      "Serbest ticaret ve asgari vergiler"
    ]
  },
  "mundo": {
    "label": "Dünya",
    "text": "Ülke dünyada nasıl hareket etmelidir?",
    "options": [
      "Etkili bir askerî güç olmalı",
      "Güçlü savunma ve yakın müttefikler",
      "Güç kullanmadan önce diplomasi",
      "Silahlı ama diğer ülkelerin savaşlarından uzak",
      "Her zaman barış ve müdahalesizlik"
    ]
  },
  "tecnologia": {
    "label": "Teknoloji",
    "text": "Teknolojinin rolü ne olmalıdır?",
    "options": [
      "Sanayi olmadan doğaya dönüş",
      "İlerleme yerine doğa",
      "İlerleme ve doğa arasında denge",
      "Teknoloji ve sanayi itici güç olmalı",
      "Teknolojiyi sınırsız hızlandırmak"
    ]
  }
};
const optionLabels: Record<string,string> = {STRONGLY_AGREE:'Kesinlikle katılıyorum',AGREE:'Katılıyorum',NEUTRAL:'Kararsızım',DISAGREE:'Katılmıyorum',STRONGLY_DISAGREE:'Kesinlikle katılmıyorum'};
export function trAxis<T extends {id:string;label:string;leftPole:string;rightPole:string}>(axis:T):T {
  return {...axis,...axes[axis.id]};
}
export function trQuiz(quiz: QuizPayload): QuizPayload {
  return {...quiz,
    title:'12 Eksen Siyasi Görüş Testi',
    description:'Siyasi görüşlerinizi 12 farklı eksende keşfedin.',
    axes:quiz.axes.map(trAxis),
    questions:quiz.questions.map(question=>({
      ...question,text:trQuestions[question.id] ?? question.text,
      terms:[],help:null
    })),
    answerOptions:quiz.answerOptions.map(option=>({...option,label:optionLabels[option.id] ?? option.label})),
    archetypeQuestions:quiz.archetypeQuestions?.map(question=>{
      const tr=archetypes[question.id];
      if (!tr) return question;
      return {...question,label:tr.label,text:tr.text,options:question.options.map((option,i)=>({...option,text:tr.options[i]??option.text}))};
    })
  };
}
export function trResult(result: QuizResult):QuizResult {
  const a=result.axes.map(axis=>{
    const dict=axes[axis.axisId];
    if(!dict) return axis;
    const dominant=axis.dominantPole===axis.leftPole?dict.leftPole:axis.dominantPole===axis.rightPole?dict.rightPole:axis.dominantPole;
    return {...axis,label:dict.label,leftPole:dict.leftPole,rightPole:dict.rightPole,dominantPole:dominant,
      intensity:({'Balanced':'Dengeli','Leaning':'Eğilimli','Strong':'Güçlü','Very strong':'Çok güçlü'} as Record<string,string>)[axis.intensity]??axis.intensity};
  });
  return {...result,axes:a};
}
export function trHomeAxes<T extends Axis>(list:T[]):T[] {return list.map(trAxis);}
