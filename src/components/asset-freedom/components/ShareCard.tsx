import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogPortal, DialogOverlay } from '@/components/ui/dialog';
import { Download, Share2, MessageCircle, Users, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';

interface ShareCardProps {
  isOpen: boolean;
  onClose: () => void;
  pageMode?: 'member-severe-shortage' | 'member-liquidity-tight' | 'member-balanced' | 'public-severe-shortage' | 'public-liquidity-tight' | 'public-balanced';
}

const ShareCard: React.FC<ShareCardProps> = ({ isOpen, onClose, pageMode = 'public-balanced' }) => {
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showQrCode, setShowQrCode] = useState<boolean>(false);

  // 生成二维码
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const url = window.location.origin + '/new';
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: 80,
          margin: 1,
          color: {
            dark: '#374151',
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(qrDataUrl);
      } catch (error) {
        console.error('生成二维码失败:', error);
      }
    };
    
    if (isOpen) {
      generateQRCode();
    }
  }, [isOpen]);

  // 创建完整的下载图片内容
  const createDownloadCard = () => {
    const downloadCard = document.createElement('div');
    downloadCard.style.cssText = `
      position: fixed;
      top: -9999px;
      left: -9999px;
      background: linear-gradient(135deg, #CAF4F7 0%, #B3EBEF 50%, #9FE6EB 100%);
      padding: 20px;
      border-radius: 16px;
      width: 320px;
    `;
    
    downloadCard.innerHTML = `
      <div style="position: relative; text-align: center;">
        <!-- 装饰性元素 -->
        <div style="position: absolute; top: 0; right: 0; width: 64px; height: 64px; opacity: 0.2;">
          <div style="width: 100%; height: 100%; border-radius: 50%; background: rgba(255,255,255,0.3); filter: blur(4px);"></div>
        </div>
        
        <!-- 标题 -->
        <div style="margin-bottom: 16px;">
          <h2 style="font-size: 18px; font-weight: bold; color: #374151; margin-bottom: 4px;">我的财富分型</h2>
          <div style="width: 32px; height: 2px; background: rgba(255,255,255,0.6); margin: 0 auto; border-radius: 999px;"></div>
        </div>

        <!-- 人设图片 -->
        <div style="display: flex; justify-content: center; margin-bottom: 12px;">
          <div style="position: relative;">
            <img 
              src="/lovable-uploads/3c9349c3-3b51-43b8-a9f3-63c0ac638452.png" 
              alt="财富分型" 
              style="width: 64px; height: 80px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 2px solid rgba(255,255,255,0.5);"
            />
            <div style="position: absolute; top: -4px; right: -4px; width: 20px; height: 20px; background: #F59E0B; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 12px; font-weight: bold;">✨</span>
            </div>
          </div>
        </div>

        <!-- 分型名称 -->
        <h3 style="font-size: 20px; font-weight: bold; color: #374151; margin-bottom: 8px;">
          ${(pageMode?.endsWith('-liquidity-tight') || pageMode?.endsWith('-balanced')) ? '资产充裕型' : '中度支出压缩型'}
        </h3>
        
        <!-- 代码标识 -->
        <div style="display: inline-block; background: rgba(255,255,255,0.4); color: #374151; border: 1px solid rgba(255,255,255,0.6); font-size: 16px; padding: 4px 12px; font-weight: bold; border-radius: 6px; margin-bottom: 12px;">
          ${(pageMode?.endsWith('-liquidity-tight') || pageMode?.endsWith('-balanced')) ? 'A3-E03-R6' : 'C01-I02-E03-R2'}
        </div>

        <!-- 解释文字 -->
        <div style="background: rgba(255,255,255,0.3); border-radius: 12px; padding: 12px; margin-bottom: 12px; backdrop-filter: blur(4px);">
          <p style="font-size: 14px; color: #374151; line-height: 1.6;">
            ${(pageMode?.endsWith('-liquidity-tight') || pageMode?.endsWith('-balanced')) ? 
              '<span style="font-weight: 600;">🎉 恭喜！</span>您的财富分型达到了A3顶级水平！这意味着您的资产储备远超未来所需，拥有了真正的财富自由。' : 
              '<span style="font-weight: 600;">危险信号！</span>您的财富状况正在亮红灯 🚨 中度压缩型意味着您的支出已经开始挤压生活品质，如果不及时调整，可能面临更严重的财务困境。现在行动还来得及！'
            }
          </p>
        </div>

        <!-- 系统功能介绍 -->
        <div style="background: linear-gradient(to right, rgba(219,234,254,0.6), rgba(237,233,254,0.6)); border-radius: 12px; padding: 12px; margin-bottom: 12px; backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.4);">
          <h4 style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; text-align: center;">🌟 专属服务体验</h4>
          <div style="font-size: 12px; color: #374151; text-align: center; line-height: 1.4;">
            <div style="font-weight: 500; margin-bottom: 2px;">💡 一分钟洞察您的财富密码</div>
            <div style="font-weight: 500; margin-bottom: 2px;">🎯 量身定制您的财富增长路径</div>
            <div style="font-weight: 500;">🛡️ 提前预知财务风险，守护财富安全</div>
          </div>
        </div>

        <!-- 二维码 -->
        <div style="display: flex; justify-content: center; margin-bottom: 12px;">
          <div style="background: white; border-radius: 12px; padding: 12px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 2px solid #DBEAFE;">
            <div style="text-align: center;">
              <img 
                src="${qrCodeUrl}" 
                alt="分享二维码" 
                style="width: 48px; height: 48px; margin: 0 auto 4px auto; display: block;"
              />
              <p style="font-size: 12px; font-weight: bold; color: #2563EB; line-height: 1.2; margin: 0;">
                立即扫码，获取您的<br/>专属财富分型！
              </p>
            </div>
          </div>
        </div>

        <!-- 底部装饰 -->
        <div style="padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.3);">
          <p style="font-size: 12px; color: #6B7280; margin: 0;">财富分型·个人专属报告</p>
        </div>
      </div>
    `;
    
    return downloadCard;
  };

  // 保存为图片
  const handleSaveAsImage = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      
      // 创建完整的下载内容
      const downloadCard = createDownloadCard();
      document.body.appendChild(downloadCard);
      
      // 等待图片加载
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const canvas = await html2canvas(downloadCard, {
        backgroundColor: '#CAF4F7',
        scale: 2,
        useCORS: true
      });
      
      // 清理临时元素
      document.body.removeChild(downloadCard);
      
      const link = document.createElement('a');
      link.download = '财富分型卡片.png';
      link.href = canvas.toDataURL();
      link.click();
      
      toast({
        title: "保存成功",
        description: "财富分型卡片已保存到本地"
      });
    } catch (error) {
      toast({
        title: "保存失败", 
        description: "请稍后重试",
        variant: "destructive"
      });
    }
  };

  // 分享给微信好友
  const handleShareToFriend = () => {
    toast({
      title: "分享功能",
      description: "请保存图片后在微信中发送给好友"
    });
  };

  // 分享到朋友圈
  const handleShareToMoments = () => {
    toast({
      title: "分享功能", 
      description: "请保存图片后发布到微信朋友圈"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        {/* 自定义遮罩层 - 只在手机可视区域内显示 */}
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 左侧区域 - 透明 */}
          <div className="flex-1 max-w-[calc((100vw-448px)/2)]"></div>
          
          {/* 手机可视区域 - 带遮罩 */}
          <div className="w-full max-w-md bg-black/80 min-h-screen relative">
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="w-full">
                <DialogHeader className="sr-only">
                  <DialogTitle>分享财富分型卡片</DialogTitle>
                </DialogHeader>
        
        {/* 自定义关闭按钮 - 放在弹窗右上角外侧 */}
        <div className="relative">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute -top-4 -right-4 z-50 w-8 h-8 rounded-full bg-white hover:bg-gray-50 shadow-lg border border-gray-200"
          >
            <X className="w-4 h-4 text-gray-600" />
          </Button>
          
          <div className="space-y-3">
            {/* 分享卡片内容 - 弹窗专用，精简版 */}
            <div 
              ref={cardRef}
              className="relative overflow-hidden rounded-2xl"
              style={{ 
                background: 'linear-gradient(135deg, #CAF4F7 0%, #B3EBEF 50%, #9FE6EB 100%)',
                padding: '20px'
              }}
            >
              {/* 装饰性元素 */}
              <div className="absolute top-0 right-0 w-16 h-16 opacity-20">
                <div className="w-full h-full rounded-full bg-white/30 blur-sm"></div>
              </div>
              
              <div className="relative z-10 text-center space-y-3">
                {/* 标题 */}
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-800 mb-1">我的财富分型</h2>
                  <div className="w-8 h-0.5 bg-white/60 mx-auto rounded-full"></div>
                </div>

                {/* 人设图片 */}
                <div className="flex justify-center mb-3">
                  <div className="relative">
                    <img 
                      src="/lovable-uploads/3c9349c3-3b51-43b8-a9f3-63c0ac638452.png" 
                      alt="财富分型" 
                      className="w-20 h-24 object-cover rounded-lg shadow-lg border-2 border-white/50" 
                    />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✨</span>
                    </div>
                  </div>
                </div>

                {/* 分型名称 */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {(pageMode?.endsWith('-liquidity-tight') || pageMode?.endsWith('-balanced')) ? '资产充裕型' : '中度支出压缩型'}
                </h3>
                
                {/* 代码标识 */}
                <Badge className="bg-white/40 text-gray-800 border border-white/60 text-base px-3 py-1 font-bold">
                  {(pageMode?.endsWith('-liquidity-tight') || pageMode?.endsWith('-balanced')) ? 'A3-E03-R6' : 'C01-I02-E03-R2'}
                </Badge>

                {/* 解释文字 */}
                <div className="bg-white/30 rounded-xl p-3 backdrop-blur-sm">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {(pageMode?.endsWith('-liquidity-tight') || pageMode?.endsWith('-balanced')) ? (
                      <>
                        <span className="font-semibold">🎉 恭喜！</span>您的财富分型达到了A3顶级水平！
                        这意味着您的资产储备远超未来所需，拥有了真正的财富自由。
                      </>
                    ) : (
                      <>
                        <span className="font-semibold">危险信号！</span>您的财富状况正在亮红灯 🚨 
                        中度压缩型意味着您的支出已经开始挤压生活品质，如果不及时调整，
                        可能面临更严重的财务困境。现在行动还来得及！
                      </>
                    )}
                  </p>
                </div>

                {/* 底部装饰 - 压缩间距 */}
                <div className="mt-2 pt-2 border-t border-white/30">
                  <p className="text-xs text-gray-600">财富分型·个人专属报告</p>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="bg-white rounded-2xl p-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleShareToFriend}
                  variant="outline"
                  className="py-3 rounded-xl flex items-center justify-center space-x-2 border-green-300 text-green-600 hover:bg-green-50"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>微信好友</span>
                </Button>
                
                <Button
                  onClick={handleShareToMoments}
                  variant="outline"
                  className="py-3 rounded-xl flex items-center justify-center space-x-2 border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <Users className="w-4 h-4" />
                  <span>朋友圈</span>
                </Button>
              </div>
              
              <Button
                onClick={handleSaveAsImage}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>保存为图片</span>
              </Button>
            </div>
            </div>
          </div>
              </div>
            </div>
          </div>
          
          {/* 右侧区域 - 透明 */}
          <div className="flex-1 max-w-[calc((100vw-448px)/2)]"></div>
        </div>
      </DialogPortal>
    </Dialog>
  );
};

export default ShareCard;