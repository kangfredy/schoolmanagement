/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config, { isServer }) => {
    // Fix for Ant Design dependencies module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      'rc-util/lib': 'rc-util/es',
      'rc-picker/lib': 'rc-picker/es',
      'rc-table/lib': 'rc-table/es',
      'rc-input/lib': 'rc-input/es',
      'rc-select/lib': 'rc-select/es',
      'rc-tree/lib': 'rc-tree/es',
      'rc-cascader/lib': 'rc-cascader/es',
      'rc-calendar/lib': 'rc-calendar/es',
      'rc-tooltip/lib': 'rc-tooltip/es',
      'rc-dropdown/lib': 'rc-dropdown/es',
      'rc-menu/lib': 'rc-menu/es',
      'rc-notification/lib': 'rc-notification/es',
      'rc-drawer/lib': 'rc-drawer/es',
      'rc-modal/lib': 'rc-modal/es',
      'rc-popover/lib': 'rc-popover/es',
      'rc-trigger/lib': 'rc-trigger/es',
    }
    
    // Handle ESM modules
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
    }
    
    return config
  },
  transpilePackages: [
    'antd', 
    'rc-util', 
    'rc-picker',
    'rc-table',
    'rc-input',
    'rc-select',
    'rc-tree',
    'rc-cascader',
    'rc-calendar',
    'rc-tooltip',
    'rc-dropdown',
    'rc-menu',
    'rc-notification',
    'rc-drawer',
    'rc-modal',
    'rc-popover',
    'rc-trigger',
    '@ant-design/icons'
  ],
}

module.exports = nextConfig