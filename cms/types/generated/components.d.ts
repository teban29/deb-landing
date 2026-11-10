import type { Schema, Struct } from '@strapi/strapi';

export interface SharedCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_cards';
  info: {
    description: 'Tarjeta con t\u00EDtulo y descripci\u00F3n';
    displayName: 'Tarjeta';
    icon: 'layout';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    description: 'Enlace a una red social';
    displayName: 'Red social';
    icon: 'link';
  };
  attributes: {
    platform: Schema.Attribute.Enumeration<
      ['facebook', 'instagram', 'tiktok', 'linkedin', 'youtube', 'google']
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedStat extends Struct.ComponentSchema {
  collectionName: 'components_shared_stats';
  info: {
    description: 'Cifra destacada con etiqueta';
    displayName: 'Estad\u00EDstica';
    icon: 'chartBubble';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    sublabel: Schema.Attribute.String;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedStep extends Struct.ComponentSchema {
  collectionName: 'components_shared_steps';
  info: {
    description: 'Paso de un proceso';
    displayName: 'Paso';
    icon: 'list';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedTextItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_text_items';
  info: {
    description: 'Fila de texto simple';
    displayName: 'Elemento de texto';
    icon: 'bulletList';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'shared.card': SharedCard;
      'shared.social-link': SharedSocialLink;
      'shared.stat': SharedStat;
      'shared.step': SharedStep;
      'shared.text-item': SharedTextItem;
    }
  }
}
