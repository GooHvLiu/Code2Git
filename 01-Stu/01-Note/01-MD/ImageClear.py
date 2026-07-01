import os
import re
import sys
from pathlib import Path

def extract_local_image_names_from_md(markdown_path):
    """
    从 Markdown 文件中提取所有本地图片链接的文件名。

    Args:
        markdown_path (str or Path): Markdown 文件的路径。

    Returns:
        set: 包含所有本地图片文件名的集合。
    """
    image_names = set()
    md_path = Path(markdown_path)

    if not md_path.exists() or not md_path.is_file():
        print(f"错误：Markdown 文件不存在或不是一个有效文件: {markdown_path}")
        return image_names

    try:
        with open(md_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        # 如果UTF-8失败，尝试其他常见编码
        try:
            with open(md_path, 'r', encoding='gbk') as f:
                content = f.read()
        except UnicodeDecodeError:
            print(f"错误：无法读取文件 '{md_path}'，可能是编码问题。")
            return image_names

    # 正则表达式匹配 Markdown 图片语法: ![alt](path/to/image.ext)
    # 这个正则会捕获括号内的链接部分
    img_regex = re.compile(r'!\[[^\]]*\]\(([^)]+)\)')
    matches = img_regex.findall(content)

    for match in matches:
        full_link = match
        # 检查是否为网络链接
        if not (full_link.lower().startswith('http://') or full_link.lower().startswith('https://')):
            # 提取文件名 (最后一个 '/' 或 '\' 后面的部分)
            filename = Path(full_link).name
            if filename: # 确保文件名不为空
                image_names.add(filename)
                
    return image_names

def get_all_image_filenames(image_path):
    """
    获取指定目录下所有文件的文件名。

    Args:
        image_path (str or Path): 图片目录的路径。

    Returns:
        set: 包含所有文件名的集合。
    """
    all_files = set()
    img_dir = Path(image_path)

    if not img_dir.exists() or not img_dir.is_dir():
        print(f"错误：图片目录不存在或不是一个有效目录: {image_path}")
        return all_files

    for item in img_dir.iterdir():
        if item.is_file():
            all_files.add(item.name)
            
    return all_files

def delete_files_individually(orphaned_files, image_path):
    """
    交互式逐个删除文件。

    Args:
        orphaned_files (list): 待删除的文件列表。
        image_path (str or Path): 图片目录路径。

    Returns:
        int: 成功删除的文件数量。
    """
    deleted_count = 0
    image_path = Path(image_path)
    print("\n--- 开始逐个确认删除 ---")
    for i, file in enumerate(orphaned_files):
        print(f" ({i+1}/{len(orphaned_files)}) 是否删除 '{file}' ? (y/N): ", end='')
        choice = input().strip().lower()
        if choice in ['y', 'yes']:
            file_to_delete = image_path / file
            try:
                file_to_delete.unlink() # 删除文件
                print(f"  -> 已删除: {file}")
                deleted_count += 1
            except OSError as e:
                print(f"  -> 删除失败: {file}, 错误: {e}")
        else:
            print(f"  -> 跳过: {file}")
    return deleted_count

def delete_all_files(orphaned_files, image_path):
    """
    批量删除所有文件。

    Args:
        orphaned_files (list): 待删除的文件列表。
        image_path (str or Path): 图片目录路径。

    Returns:
        int: 成功删除的文件数量。
    """
    success_count = 0
    image_path = Path(image_path)
    print("\n--- 正在批量删除所有多余文件 ---")
    for file in orphaned_files:
        file_to_delete = image_path / file
        try:
            if file_to_delete.is_file(): # 确认文件存在
                file_to_delete.unlink()
                print(f"  -> 已删除: {file}")
                success_count += 1
            else:
                print(f"  -> 文件不存在，跳过: {file}")
        except OSError as e:
            print(f"  -> 删除失败: {file}, 错误: {e}")
    return success_count

def print_title(title):
    """打印带装饰的标题"""
    separator = "=" * max(len(title), 40)
    print(separator)
    print(f"{title:^{max(len(title), 40)}}")
    print(separator)

def print_separator(char='-', length=50):
    """打印分割线"""
    print(char * length)

def main():
    print_title("Markdown 图片清理工具")

    # 获取用户输入
    markdown_path = input("请输入 Markdown 文件的完整路径: ").strip()
    image_path = input("请输入图片保存目录的完整路径: ").strip()

    print_separator('*')
    print("正在执行分析任务...")
    print_separator('*')

    # 1. 提取 Markdown 文件中引用的本地图片文件名
    print("🔍 步骤 1/3: 分析 Markdown 文件中的本地图片链接...", end='')
    referenced_images = extract_local_image_names_from_md(markdown_path)
    print(f" 完成 (找到 {len(referenced_images)} 个引用)")

    # 2. 获取图片目录下所有文件名
    print("🔍 步骤 2/3: 扫描图片目录...", end='')
    all_images_in_dir = get_all_image_filenames(image_path)
    print(f" 完成 (找到 {len(all_images_in_dir)} 个文件)")

    # 3. 计算差集
    orphaned_files = []  # 目录中多余文件
    missing_files = []   # Markdown 中缺失文件

    for file in all_images_in_dir:
        if file not in referenced_images:
            orphaned_files.append(file)

    for file in referenced_images:
        if file not in all_images_in_dir:
            missing_files.append(file)

    # 4. 报告结果
    print_separator('*')
    print("✅ 步骤 3/3: 分析完成，正在生成报告...")
    print_separator('*')

    deleted_count = 0
    if orphaned_files:
        print(f"\n⚠️  发现 {len(orphaned_files)} 个多余的文件:")
        for file in orphaned_files:
            print(f"    📄 {file}")

        print("\n请选择操作:")
        print("  [1] 全部删除")
        print("  [2] 逐个确认删除")
        print("  [0] 跳过，不做任何操作")
        choice = input("请输入您的选择 (0, 1 或 2): ").strip()

        if choice == '1':
            deleted_count = delete_all_files(orphaned_files, image_path)
        elif choice == '2':
            deleted_count = delete_files_individually(orphaned_files, image_path)
        elif choice == '0':
            print("已选择跳过删除操作。")
        else:
            print("无效选择，跳过删除操作。")
    else:
        print("\n✅ 图片目录中没有发现多余文件。")

    if missing_files:
        print(f"\n❌ 发现 {len(missing_files)} 个在 Markdown 中引用但本地目录中缺失的文件:")
        for file in missing_files:
            print(f"    📄 {file}")
        print("\n💡 请检查这些文件是否已被误删或路径是否正确。")
    else:
        print("\n✅ 所有 Markdown 中引用的图片在本地目录中均能找到。")

    # 5. 输出最终报告
    print_title("最终检查报告")
    print(f"{'总扫描文件数 (本地目录):':<35} {len(all_images_in_dir):>20}")
    print(f"{'Markdown 中引用的本地文件数:':<35} {len(referenced_images):>20}")
    print(f"{'发现的多余文件数:':<35} {len(orphaned_files):>20}")
    print(f"{'成功删除的文件数:':<35} {deleted_count:>20}")
    print(f"{'本地目录中缺失的文件数:':<35} {len(missing_files):>20}")
    print_separator('=')

    print("\n程序执行完毕。感谢使用！")
    input("按回车键退出...")

if __name__ == "__main__":
    main()