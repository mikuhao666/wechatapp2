export type UserRole = 'staff' | 'leader';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  department: string;
}

export type DisasterType = 
  | '暴雨洪涝'
  | '雷暴大风'
  | '冰雹灾害'
  | '高温干旱'
  | '低温冻害'
  | '连阴雨'
  | '龙卷风'
  | '雪灾冻雨';

export type ApplicationStatus = '待受理' | '开具中' | '待审批' | '已通过' | '已办结' | '已驳回';

export interface MaterialItem {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'pdf' | 'doc';
  uploadTime: string;
  description: string;
}

export interface CertificateDraft {
  certNumber: string;
  title: string;
  content: string;
  disasterTimeText: string;
  location: string;
  disasterType: string;
  obsDataSummary: string;
  recipientOrg: string; // 用途/抬头：如 中国人民财产保险随州分公司
  draftedBy: string;
  draftDate: string;
  reviewComment?: string;
  reviewedBy?: string;
  reviewDate?: string;
  rejectReason?: string;
}

export interface WorkflowLog {
  id: string;
  time: string;
  operator: string;
  role: string;
  action: string;
  note?: string;
}

export interface Application {
  _id?: string;
  id: string;
  type: '个人' | '单位';
  applicant: string;
  idCardOrCreditCode: string;
  phone: string;
  address: string;
  disasterType: DisasterType;
  occurrenceTime: string;
  location: string;
  reason: string;
  submitTime: string;
  status: ApplicationStatus;
  materials: MaterialItem[];
  certificate?: CertificateDraft;
  logs: WorkflowLog[];
}
