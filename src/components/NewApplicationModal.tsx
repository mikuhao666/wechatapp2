import React, { useState } from 'react';
import { Application, DisasterType } from '../types';
import { updateApplication } from '../data/storage';
import { X, Plus, FileText, Upload, Calendar, MapPin, Building, User } from 'lucide-react';

interface NewApplicationModalProps {
  onClose: () => void;
  onAdded: (updatedApps: Application[]) => void;
}

export const NewApplicationModal: React.FC<NewApplicationModalProps> = ({
  onClose,
  onAdded
}) => {
  const [type, setType] = useState<'个人' | '单位'>('个人');
  const [applicant, setApplicant] = useState<string>('何启明');
  const [idCardOrCode, setIdCardOrCode] = useState<string>('421302198411053321');
  const [phone, setPhone] = useState<string>('13972887766');
  const [address, setAddress] = useState<string>('随州市随县厉山镇神农大道12号');
  const [disasterType, setDisasterType] = useState<DisasterType>('暴雨洪涝');
  const [occurrenceTime, setOccurrenceTime] = useState<string>('2026-08-25 04:00 至 09:00');
  const [location, setLocation] = useState<string>('随县厉山镇神农茶叶种植合作社茶园');
  const [reason, setReason] = useState<string>('突发特大暴雨引发山体坡面径流冲毁茶园护坎与幼苗，向保险公司报案申请茶叶种植天气指数保险核灾理赔。');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const id = `SQ-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;

    const newApp: Application = {
      id,
      type,
      applicant,
      idCardOrCreditCode: idCardOrCode,
      phone,
      address,
      disasterType,
      occurrenceTime,
      location,
      reason,
      submitTime: timeStr,
      status: '待受理',
      materials: [
        {
          id: 'mat-' + Date.now() + '-1',
          name: `${applicant}_身份证明材料.pdf`,
          size: '1.2 MB',
          type: 'pdf',
          uploadTime: timeStr,
          description: '申请人法定身份材料核验'
        },
        {
          id: 'mat-' + Date.now() + '-2',
          name: `${disasterType}_现场勘查受灾影像.jpg`,
          size: '3.6 MB',
          type: 'image',
          uploadTime: timeStr,
          description: '事发地点灾情现场照片'
        }
      ],
      logs: [
        {
          id: 'log-' + Date.now(),
          time: timeStr,
          operator: applicant,
          role: '申请人',
          action: '网上政务服务窗口提交证明申请',
          note: '已上传两份法定证明佐证附件'
        }
      ]
    };

    const updated = updateApplication(newApp);
    onAdded(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#0B2545] text-white px-6 py-4 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-2.5">
            <Plus className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base">受理新增气象证明申请（业务录入）</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          
          {/* Type Selector */}
          <div className="flex gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <label className="font-bold text-slate-700 flex items-center gap-1 shrink-0">
              申请主体类型：
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-800">
              <input 
                type="radio" 
                name="type" 
                checked={type === '个人'} 
                onChange={() => setType('个人')} 
                className="text-blue-600"
              />
              个人（自然人 / 农户）
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-800">
              <input 
                type="radio" 
                name="type" 
                checked={type === '单位'} 
                onChange={() => setType('单位')} 
                className="text-blue-600"
              />
              企事业单位 / 合作社
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {type === '个人' ? '申请人姓名' : '企业/单位法定名称'} *
              </label>
              <input
                type="text"
                required
                value={applicant}
                onChange={(e) => setApplicant(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {type === '个人' ? '身份证号码' : '统一社会信用代码'} *
              </label>
              <input
                type="text"
                required
                value={idCardOrCode}
                onChange={(e) => setIdCardOrCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">联系电话 *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">气象灾害天气类型 *</label>
              <select
                value={disasterType}
                onChange={(e) => setDisasterType(e.target.value as DisasterType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600"
              >
                <option value="暴雨洪涝">暴雨洪涝</option>
                <option value="雷暴大风">雷暴大风</option>
                <option value="冰雹灾害">冰雹灾害</option>
                <option value="高温干旱">高温干旱</option>
                <option value="低温冻害">低温冻害</option>
                <option value="连阴雨">连阴雨</option>
                <option value="雪灾冻雨">雪灾冻雨</option>
                <option value="龙卷风">龙卷风</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">联系通讯地址</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">灾害发生确切时间 *</label>
              <input
                type="text"
                required
                value={occurrenceTime}
                onChange={(e) => setOccurrenceTime(e.target.value)}
                placeholder="如：2026-08-25 04:00 至 09:00"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">受灾发生确切地点 *</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="如：随县厉山镇神农大道..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">申请事由与损失描述（保险理赔等）*</label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600 leading-relaxed"
            />
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1 text-blue-800 font-medium">
              <Upload className="w-3.5 h-3.5 text-blue-600" />
              已自动关联生成模拟支撑材料（身份证件、现场勘查高清照片）
            </span>
            <span className="text-[11px] text-blue-600 font-mono">2份材料已就绪</span>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg font-medium hover:bg-slate-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold shadow-sm transition"
            >
              确认登记受理
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
