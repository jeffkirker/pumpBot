export interface CompanyDetails {
  companyName: string,
  companyTicker: string,
  exchange: string,
  currentPrice: number,
  priceChange: number,
  todaysMentions: number,
  vaderPositiveMentions: number,
  vaderNeutralMentions: number,
  vaderNegativeMentions: number,
  textBlobPositiveMentions: number,
  textBlobNeutralMentions: number,
  textBlobNegativeMentions: number
}
